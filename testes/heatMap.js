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
 * Função para mudar o formato de data, passando para yyyy-mm-ddT00:00:00.000Z.
 * @param {*} dateString 
 * @returns 
 */
function parseDate(dateString) {
    const parts = dateString.split("/");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
}


module.exports = {
    createRooms : createRooms,
    parseDate : parseDate, 
    handleInputs : handleInputs,
};