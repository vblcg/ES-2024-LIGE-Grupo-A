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

/**
 * Cria a network graph tendo por base os inputs do utilizador
 */
function updateGraph() {
    var svg = d3.select("#graph")
        .append("svg")
        .style("width", "100%")
        .attr("height", "100%");

    var width = window.innerWidth;
    var height = window.innerHeight;
    var margin = 50;

    var bbox = {
        x1: margin,
        y1: margin,
        x2: width - margin,
        y2: height - margin
    };

    nodes.forEach(function(node) {
        var minDistance = 50; 

        do {
            node.x = Math.random() * width;
            node.y = Math.random() * height;

            var hasCollision = nodes.some(function(otherNode) {
                if (otherNode !== node) {
                    var dx = otherNode.x - node.x;
                    var dy = otherNode.y - node.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    return distance < minDistance;
                }
                return false;
            });
        } while (hasCollision);
    });

    var force = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(100).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX().strength(0.05).x(d => Math.max(margin, Math.min(width - margin, d.x))))
        .force("y", d3.forceY().strength(0.05).y(d => Math.max(margin, Math.min(height - margin, d.y))))
        .on("tick", ticked);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 15)
        .attr("fill", "orange")
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));

    var text = svg.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.name  + d.aulaData["Dia da Semana"]) 
        .attr("x", 0)
        .attr("y", -20)
        .style("text-anchor", "middle") 
        .style("font-size", "12px") 
        .style("fill", "black"); 

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
}



/**
 * Verifica se uma aula está em conflito com a outra (forem à mesma hora independentemente do dia).
 * @param {*} aula1 - Aula a ser comparada.
 * @param {*} aula2- Aula a ser comparada.
 * @returns True se as aulas forem à mesma hora e False caso contrário.
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


/**
 * Verifica as aulas que colidem, cria os links entre as mesmas e .
 * adiciona os mesmos à variável "links".
 * @param {*} nodes - Aulas.
 */
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



document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('submit');
    const cursoInput = document.getElementById('curso');
    const ucInput = document.getElementById('uc');
    const data_inicioInput = document.getElementById('data_inicio');
    const data_fimInput = document.getElementById('data_fim');

    function enableButton() {
        button.disabled = false;
    }

    function clearGraph() {
        d3.select("#graph").select("svg").remove();
        nodes = [];
        links = [];
    }

    cursoInput.addEventListener('input', function() {
        enableButton();
        clearGraph();
    });
    ucInput.addEventListener('input', function() {
        enableButton();
        clearGraph();
    });
    data_inicioInput.addEventListener('input', function() {
        enableButton();
        clearGraph();
    });
    data_fimInput.addEventListener('input', function() {
        enableButton();
        clearGraph();
    });

    button.addEventListener('click', function(event) {
        event.preventDefault();

        const cursoValue = cursoInput.value;
        const ucValue = ucInput.value;
        const dataInicioValue = data_inicioInput.value;
        const dataFimValue = data_fimInput.value;

        const dataInicioDate = new Date(dataInicioValue);
        const dataFimDate = new Date(dataFimValue);

        let filteredData = [];

        if (ucValue == '' && cursoValue != '' && dataInicioValue != '' && dataFimValue != '') {
            filteredData = jsonData.filter(item => {
                const itemData = new Date(item['Data da aula']);

                return (
                    item['Curso'].includes(cursoValue) &&
                    itemData >= dataInicioDate &&
                    itemData <= dataFimDate
                );

                
            });

            createNodes(filteredData, 'UC');
            
        } else if (cursoValue == '' && ucValue != '' && dataInicioValue != '' && dataFimValue != '') {
            filteredData = jsonData.filter(item => {
                const itemData = new Date(item['Data da aula']);

                return (
                    item['UC'] === ucValue &&
                    itemData >= dataInicioDate &&
                    itemData <= dataFimDate
                );
            });

            createNodes(filteredData, 'Curso');

        } else if (dataInicioValue != '' && dataFimValue != '' && cursoValue != '' && ucValue != '') {
            filteredData = jsonData.filter(item => {
                const itemData = new Date(item['Data da aula']);

                return (
                    item['Curso'].includes(cursoValue) &&
                    item['UC'] === ucValue &&
                    itemData >= dataInicioDate &&
                    itemData <= dataFimDate
                );
            });

            createNodes(filteredData, '');
        } else {
            alert("Preencha os campos obrigatórios e indique o Curso e/ou a UC");
        }

        button.disabled = true;


        console.log(nodes);

        createLinks(nodes);

        updateGraph();
    });

});


/**
 * Cria nós com base nos dados fornecidos e no nome do nó. Preenche a variável "nodes".
 * @param {Array} filteredData - Array com as aulas filtradas, tendo em conta a escolha do utilizador.
 * @param {string} nameNode - O nome do atributo necessário para o preenchimento do nome do nó.
 */
function createNodes(filteredData, nameNode){
    if (nameNode != ''){
        filteredData.forEach(aula => {
            nodes.push({
                id: aula.Curso + ' ' + aula['Turno'], 
                aulaData: aula, 
                name: aula[nameNode] + ' - '
            });
        });
    } else {
        filteredData.forEach(aula => {
            nodes.push({
                id: aula.Curso + ' ' + aula['Turno'], 
                aulaData: aula, 
                name: ''
            });
        });
    }
}