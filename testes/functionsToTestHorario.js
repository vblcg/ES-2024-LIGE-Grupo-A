 /**
    * Verifica se um array está vazio.
    * @param {Array} array - O array a ser verificado.
    * @returns {boolean} - Retorna verdadeiro se o array estiver vazio, caso contrário, retorna falso.
*/
function checkIfEmpty(array) {
    if (array.length === 0) {
        return true;
    } else {
        return false;
    }
}

 /**
     * Cria um novo registo de aula em formato json.
     * @param {Array} inputArray - Array com os valores dos parâmetros de uma aula.
     * @returns {Object} - O objeto json que representa o registo de uma aula
     */
 function createJsonEntry(inputArray){
    const jsonObject = {};
    const columnsArray = [
        "Curso",
        "UC",
        "Turno",
        "Turma",
        "Inscritos no Turno",
        "Dia da Semana",
        "Hora Início da Aula",
        "Hora Fim da Aula",
        "Data da aula",
        "Caracteristicas da sala pedida para a aula",
        "Sala atribuida a aula",
        "Semana do ano",
        "Semana do semestre"
    ];

    columnsArray.forEach((title, index) => {
        jsonObject[title] = inputArray[index];
    });

    return jsonObject;
}

module.exports = {
    checkIfEmpty : checkIfEmpty,
    createJsonEntry : createJsonEntry,
};