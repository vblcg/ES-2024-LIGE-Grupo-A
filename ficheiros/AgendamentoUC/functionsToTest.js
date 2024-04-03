function decimalParaHora(decimal) {
    let horaInteira = Math.floor(decimal);
    let minutos = Math.round((decimal - horaInteira)*100)/100;
    if(minutos == 0.6) return Math.round(decimal); else return decimal;
}

module.exports = decimalParaHora;
