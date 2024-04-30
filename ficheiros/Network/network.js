const pathHorario = "../Horário.json";

let jsonData = [];
let ucs = [];
let cursos = new Set();
let nodes = [];
let links = [];

fetch(pathHorario)
.then(response => response.json())
.then(data => {

        
        jsonData = data;
        data.forEach(item => {
            const cursoList = item['Curso'].split(',').map(curso => curso.trim());
            cursoList.forEach(curso => cursos.add(curso));

        });

        cursos = Array.from(cursos);

        ucs = [...new Set(data.map(item => item['UC']))];

        const cursoDropdown = document.getElementById('curso');

        cursos.forEach(curso => {
          const option = document.createElement('option');
          option.text = curso;
          cursoDropdown.add(option);
        });

        const ucDropdown = document.getElementById('uc');

        ucs.forEach(uc => {
          const option = document.createElement('option');
          option.text = uc;
          ucDropdown.add(option);
        });

    })
.catch(error => {
    console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
});


function updateGraph() {

    const width = 600;
    const height = 400;

    // Create the SVG element
    const svg = d3.select("#graph")
        .attr("width", width)
        .attr("height", height);

    // Set up the D3 force simulation
    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Add nodes
    const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("fill", "skyblue");

    // Add labels to nodes
    const label = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr("font-size", "12px")
        .attr("dx", 25)
        .attr("dy", 5);

    // Define tick function for simulation
    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label.attr("x", d => d.x)
            .attr("y", d => d.y);
    });
}


/**
 * Verifica se uma aula está em conflito com a outra
 * @param {*} aula 
 * @param {*} aula
 * @returns 
 */
function isConflict(aula1, aula2) {

    const dia = "2024-01-01"; 

    const horaInicioAula1 = new Date(dia + 'T'+ aula1['Hora Inicio da Aula']);
    const horaFimAula1 = new Date(dia + 'T' + aula1['Hora Fim da Aula']);
    const horaInicioAula2 = new Date(dia + 'T' + aula2['Hora Inicio da Aula']);
    const horaFimAula2 = new Date(dia + 'T' + aula2['Hora Fim da Aula']);

    if ((horaInicioAula1 < horaFimAula2 && horaFimAula1 > horaInicioAula2) || 
        (horaInicioAula2 < horaFimAula1 && horaFimAula2 > horaInicioAula1)) {
        return true;
    }
    return false;
}

function createLinks(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const aula1 = nodes[i].aulaData;
            const aula2 = nodes[j].aulaData;
            if (isConflict(aula1, aula2)) {
                links.push({ source: nodes[i], target: nodes[j] });
            }
        }
    }
}



// Variável que verifica se o curso mudou
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('submit');

    button.addEventListener('click', function(event) {
        event.preventDefault();
        
        const cursoInput = document.getElementById('curso').value;
        const ucInput = document.getElementById('uc').value;
        const data_inicioInput  = document.getElementById('data_inicio').value;
        const data_fimInput  = document.getElementById('data_fim').value;

        const dataInicioDate = new Date(data_inicioInput);
        const dataFimDate = new Date(data_fimInput);        

        const filteredData = jsonData.filter(item => {
            const itemData = new Date(item['Data da aula']);

    
            return (
                item['Curso'].includes(cursoInput) &&
                item['UC'] === ucInput &&
                itemData >= dataInicioDate &&
                itemData <= dataFimDate
            );
        });

        filteredData.forEach(aula => {
            nodes.push({
                id: aula.Curso + ' ' + aula['Turno'], // Identificador único do nó
                aulaData: aula // Informações sobre a aula
            });
        });


        createLinks(nodes);

        updateGraph()
    
    });
        

});




/** 

// Função para verificar se duas aulas têm conflito (sobreposição de horário)
function aulasConflitantes(aula1, aula2) {
    return (
        aula1["Semana do ano"] === aula2["Semana do ano"] &&
        aula1["Dia da Semana"] === aula2["Dia da Semana"] &&
        (
            (aula1["Hora Inicio da Aula"] < aula2["Hora Fim da Aula"]) &&
            (aula1["Hora Fim da Aula"] > aula2["Hora Inicio da Aula"])
        )
    );
}

// Criar nós e arestas
var nodes = jsonData.map((aula, index) => ({
    id: index,
    name: aula["UC"] + " (" + aula["Turma"] + ")"
}));

var links = [];

for (var i = 0; i < jsonData.length; i++) {
    for (var j = i + 1; j < jsonData.length; j++) {
        if (aulasConflitantes(jsonData[i], jsonData[j])) {
            links.push({ source: i, target: j });
        }
    }
}

// Configurar o gráfico com D3.js
var svg = d3.select("#graph")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400);

var force = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(100).strength(0.1))
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(300, 200))
    .on("tick", ticked);

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .jsonData(links)
    .enter()
    .append("line")
    .attr("class", "link");

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .jsonData(nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .attr("fill", "#3498db")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

var text = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .jsonData(nodes)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("x", -10)
    .attr("y", 3);

function ticked() {
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    text
        .attr("x", d => d.x)
        .attr("y", d => d.y);
}

function dragStarted(event, d) {
    if (!event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

*/
