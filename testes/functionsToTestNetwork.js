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

function createNodes(filteredData, nameNode, nodes){
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

module.exports = {
    isConflict : isConflict,
    createNodes : createNodes,
};