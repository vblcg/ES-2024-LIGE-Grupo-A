function decimalParaHora(decimal) {
    let horaInteira = Math.floor(decimal);
    let minutos = Math.round((decimal - horaInteira)*100)/100;
    if(minutos == 0.6) return Math.round(decimal); else return decimal;
}

function initParametrosSemana(diasSemanaInput) {
    const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    var diaSemanaNumero = 0;
    console.log(diasSemanaInput);
    if (diasSemanaInput != null) {
        var diaSemanaString = diasSemanaInput[0];
        var inputsDias = diasSemanaInput.length;
    } else {
        var diaSemanaString = diasDaSemana[0];
        var inputsDias = 0;
    }
    return  [diaSemanaNumero, diaSemanaString, inputsDias];
}

function filterCapacidade(salas, numeroAlunos) {
    if(numeroAlunos != null) {
        return salas.filter(entry => parseFloat(entry['Capacidade Normal']) >= numeroAlunos);
    } else {
        return salas;
    }
}

module.exports = {
    decimalParaHora: decimalParaHora,
    initParametrosSemana: initParametrosSemana,
    filterCapacidade : filterCapacidade
};