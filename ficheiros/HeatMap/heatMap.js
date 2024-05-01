let horario;
let salas;

/**
 * Função para que apareçam os tipos de sala para o utilizador filtrar.
 * @param {*} keys 
 */
function createRooms(keys, roomTypeSelect) {
    keys.forEach(sala => {
        if(sala != "Nome sala" && sala != "Capacidade Normal" && sala != "Capacidade Exame" && sala != "Nº características" && sala != "Edifício") {
            const option = document.createElement("option");
            option.value = sala; 
            option.textContent = sala; 
            roomTypeSelect.appendChild(option);
        }  
    });
}

fetch('CaracterizacaoDasSalas.json')
.then(response => response.json())
.then(data => {
    salas = data;
    const roomTypeSelect = document.getElementById("room-type");
    const defaultOption = document.createElement("option");
    defaultOption.value = "any";

    const firstSala = data[0];
    const keys = Object.keys(firstSala);
    createRooms(keys, roomTypeSelect);
})
.catch(error => {
    console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
});

fetch('Horário.json')
.then(response => response.json())
.then(data => {
    horario = data;

    document.getElementById("apply-filters").addEventListener("click", function () {
    const inputs = [
        document.getElementById("room-type").value,
        document.getElementById("capacity").value,
        document.getElementById("start-date").value,
        document.getElementById("end-date").value,
    ];

    var salasFiltered = salas;
    var horarioFiltered = horario; 

    outputs = handleInputs(inputs, horarioFiltered, salasFiltered);
    salasFiltered = outputs[0];
    horarioFiltered = outputs[1];

    const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const slots = ["08:00:00", "09:30:00", "11:00:00", "14:30:00", "16:00:00", "18:00:00", "19:30:00", "21:00:00"];
    const min = 0;
    const max = 100;
    const colorScale = d3.scaleLinear().domain([min, max]).range(["#0000ff", "#ff0000"]);
    const heatmap = d3.select("#heatmap");

    //Apaga conteúdo atual
    heatmap.html(""); 

    diasDaSemana.forEach((dia) => {
        const row = heatmap.append("div").attr("class", "heatmap-row");
        slots.forEach((slot) => {
            const salasOcupadas = [];
            const valor = horarioFiltered.filter((item) => item["Dia da Semana"] === dia && item["Hora Inicio da Aula"] === slot);
            valor.forEach((sala) => {
                if (!salasOcupadas.includes(sala["Sala atribuida a aula"]) && salasFiltered.includes(sala["Sala atribuida a aula"])) {
                    salasOcupadas.push(sala["Sala atribuida a aula"]);
                }
            });
            const cor = salasOcupadas.length != null ? colorScale(salasOcupadas.length) : "#0000ff";
            row.append("div")
                .attr("class", "heatmap-cell")
                .style("background-color", cor)
                .text(`${dia} - ${slot}\n Salas Ocupadas: ${salasOcupadas.length}`);
        });
    });
});

/**
 * Função que filtra o horário e as salas, de acordo com os inputs do utilizador.
 * @param {*} inputs 
 * @param {*} horario 
 * @param {*} salas 
 * @returns 
 */
function handleInputs(inputs, horario, salas) {
    const tipoSala = inputs[0];
    const capacidade = parseInt(inputs[1], 10);
    const dataInicio = new Date(inputs[2]);
    const dataFim = new Date(inputs[3]);

    var horarioFiltered = horario.filter((item) => parseDate(item["Data da aula"]).getTime() >= dataInicio.getTime() && parseDate(item["Data da aula"]).getTime() <= dataFim.getTime());
    if(capacidade != null)
        var salasFiltered = salas.filter((item) => item["Capacidade Normal"] >= capacidade);
    if(tipoSala != "any")
        salasFiltered = salasFiltered.filter(item => item[tipoSala] == 1);

    return [salasFiltered.map((item) => item["Nome sala"]), horarioFiltered];
}


/**
 * Função para mudar o formato de data, passando para yyyy/mm/dd.
 * @param {*} dateString 
 * @returns 
 */
function parseDate(dateString) {
    const parts = dateString.split("/");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
}});

