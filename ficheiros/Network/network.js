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

            nodes.push({
                id: item.Curso + ' ' + item['Turno'], // Identificador único do nó
                aulaData: item // Informações sobre a aula
            });
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
        
        links = createLinks(nodes);

    })
.catch(error => {
    console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
});


function updateGraph() {
    const selectedCurso = document.getElementById('curso').value;
    const filteredData = jsonData.filter(item => item['Curso'] === selectedCurso);
    const svg = d3.select("#graph");


    // Set up the D3 force simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(500, 300));

    // Update links
    const link = svg.selectAll(".link")
        .data(links)
        .join("line")
        .attr("class", "link")
        .style("stroke-width", 2);

    // Update nodes
    const node = svg.selectAll(".node")
        .data(nodes)
        .join("circle")
        .attr("class", "node")
        .attr("r", 10)
        .style("fill", d => isConflict(d, filteredData) ? "red" : "#66a3ff") 
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Function to handle drag start
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    // Function to handle drag
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    // Function to handle drag end
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}


/**
 * Verifica se uma aula está em conflito com a outra
 * @param {*} aula 
 * @param {*} aula
 * @returns 
 */
function isConflict(node, filteredData) {
    const aula = node.aulaData;
    for (let other of filteredData) {
        if (aula !== other && aula['Dia da Semana'] === other['Dia da Semana']) {
            const horaInicioAula1 = new Date('2024-01-01T' + aula['Hora Inicio da Aula']);
            const horaFimAula1 = new Date('2024-01-01T' + aula['Hora Fim da Aula']);
            const horaInicioAula2 = new Date('2024-01-01T' + other['Hora Inicio da Aula']);
            const horaFimAula2 = new Date('2024-01-01T' + other['Hora Fim da Aula']);

            if ((horaInicioAula1 < horaFimAula2 && horaFimAula1 > horaInicioAula2) || 
                (horaInicioAula2 < horaFimAula1 && horaFimAula2 > horaInicioAula1)) {
                return true;
            }
        }
    }
    return false;
}

function createLinks(nodes) {
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const aula1 = nodes[i].aulaData;
            const aula2 = nodes[j].aulaData;
            if (isConflict(aula1, aula2)) {
                links.push({ source: nodes[i], target: nodes[j] });
            }
        }
    }
    return links;
}



// Variável que verifica se o curso mudou
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('curso').addEventListener('change', updateGraph);
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
