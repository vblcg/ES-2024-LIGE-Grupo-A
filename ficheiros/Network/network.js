fetch('Horário.json')
        .then(response => response.json()) // Convertendo a resposta para JSON
        .then(data => {
            // Armazenando os dados do JSON em uma variável
            jsonData = data;

        })
        .catch(error => {
            console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
        });

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
