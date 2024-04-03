function decimalParaHora(decimal) {
    let horaInteira = Math.floor(decimal);
    let minutos = decimal - horaInteira;
    if(minutos == 0.6) return Math.round(horaInteira); else return decimal;
}

module.exports = decimalParaHora;
