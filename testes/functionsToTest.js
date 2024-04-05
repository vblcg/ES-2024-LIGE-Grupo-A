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

function parseHour(hour) {
    if(hour.includes("."))
        return hour.replace(".", ":") + "0";
    return hour;
}

function criarDocumentoSlot(nomeCurso, UC, numeroAlunos, diaSemanaString, min, max, semanaSemestre, preferencia, salaAlocada) {
    const novaAula = {
        "Curso": nomeCurso,
        "UC": UC,
        "Turno": 1,
        "Turma": 1,
        "Inscritos no Turno": parseInt(numeroAlunos),
        "Dia da Semana": diaSemanaString,
        "Hora Inicio da Aula": parseHour(min),
        "Hora Fim da Aula": parseHour(max),
        "Data da aula": "",
        "Semana do ano": "",
        "Semana do semestre": semanaSemestre,
        "Caracteristicas da sala pedida para a aula": preferencia,
        "Sala atribuida a aula": salaAlocada['Nome sala'],
    };
    return novaAula;
}

function adicionarAulas(inputs) {
    let filteredJson = jsonData;
    let UC = inputs[0];
    let numeroAulas = inputs[1];
    let periodos = inputs[2];
    let diasSemanaInput = inputs[3];
    let preferencias = inputs[4];
    let salasInaceitaveis = inputs[5];
    var numeroAlunos = inputs[6];
    let nomeCurso = inputs[7];
    var preferencia = null;
    const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    //INICIALIZAÇÃO PARAMETROS SEMANA -> diaSemanaString ex: "Seg", diaSemanaNumero -> para aceder aos arrays, inputsDias -> para verificar se já se viram todos os dias de input
    let results = initParametrosSemana(diasSemanaInput); //Testado
    var diaSemanaNumero = results[0];
    var diaSemanaString = results[1];
    var inputsDias = results[2];
    //let salasDisponiveis = salas.map(room => room['Nome sala']);

    var semanaSemestre = parseInt(inputs[8]); 
    for(let semana = 0; semana < numeroAulas; semana++) {
        var exist = false;
        var horaCount = 1;
        if(periodos == null) {
            var min = 8.0;
            var max = 9.30;
        } else {
            var min = parseFloat(periodos[0].split("-")[0]);
            var max = parseFloat(periodos[0].split("-")[1]);
            var countPeriodosInput = 1;
        }
        while(!exist) {
            if (semanaSemestre >= parseInt(inputs[8]) + 15) {
                alert("Não é possível marcar o número de aulas pedido. Tente novamente.");
                break;
            }
            //console.log(semanaSemestre);
            //LÓGICA SLOTS
            if(periodos == null) {
                if(max + (1.67 * horaCount) >= 23.00) {
                    min = 8.0;
                    max = 9.30;
                    horaCount = 0; 
                    diaSemanaNumero += 1; //AVANÇA UM DIA NA SEMANA
                    if(diasSemanaInput != null && diaSemanaNumero < inputsDias) {
                        diaSemanaString = diasSemanaInput[diaSemanaNumero]; //SE AINDA HOUVER MAIS DIAS SELECIONADOS PARA VERIFICAR
                    } else if(diasSemanaInput == null) {
                        diaSemanaString = diasDaSemana[diaSemanaNumero]; //SE NÃO SE TIVEREM SELECIONADO DIAS
                    } else if(semanaSemestre >= 15) { 
                        alert("Não há slots suficientes para as condições pedidas. Tente novamente.");
                        break;
                    } else {
                        semanaSemestre += 1;
                        diaSemanaNumero = 0;
                    }
                } else {
                    min += decimalParaHora((1.3 * horaCount));
                    max += decimalParaHora((1.3 * horaCount));
                    horaCount ++;
                }
            } else { 
                if(decimalParaHora(min + 1.3) >= max && countPeriodosInput < periodos.length) {
                    min = parseFloat(periodos[countPeriodosInput].split("-")[0]);
                    max = parseFloat(periodos[countPeriodosInput].split("-")[1]);
                    countPeriodosInput ++;
                } else if(countPeriodosInput >= periodos.length){
                    diaSemanaNumero += 1;
                    min = parseFloat(periodos[0].split("-")[0]);
                    max = parseFloat(periodos[0].split("-")[1]);
                    if(diasSemanaInput != null && diaSemanaNumero < inputsDias) {
                        diaSemanaString = diasSemanaInput[diaSemanaNumero]; //SE AINDA HOUVER MAIS DIAS SELECIONADOS PARA VERIFICAR
                    } else if(diasSemanaInput == null) {
                        diaSemanaString = diasDaSemana[diaSemanaNumero]; //SE NÃO SE TIVEREM SELECIONADO DIAS
                    } else if(semanaSemestre >= 15) { 
                        alert("Não há slots suficientes para as condições pedidas. Tente novamente.");
                        break;
                    } else {
                        semanaSemestre += 1;
                        diaSemanaNumero = 0;
                    }
                } else {
                    min = decimalParaHora(min + 1.3);
                }  
            } 
            //FILTRO CAPACIDADE -> Testado
            var filteredSalas = filterCapacidade(salas, numeroAlunos);

            //FILTRO SALAS INACEITAVEIS
            filteredSalas = filteredSalas.filter(entry => !salasInaceitaveis.includes(entry['Caracteristicas da sala pedida para a aula']));
            
            //FILTRO DIA DA SEMANA
            filteredJson = jsonData.filter(entry => diaSemanaString == entry['Dia da Semana']);
            
            //FILTRO SEMANA DO SEMESTRE 
            filteredJson = filteredJson.filter(entry => entry['Semana do semestre'] == semanaSemestre);

            //FILTRO POR SLOT
            filteredJson = filteredJson.filter(entry => min <= parseFloat(entry["Hora Inicio da Aula"].split(':')[0] + '.' + entry["Hora Inicio da Aula"].split(':')[1]));
            filteredJson = filteredJson.filter(entry =>  parseFloat(entry["Hora Fim da Aula"].split(':')[0] + '.' + entry["Hora Fim da Aula"].split(':')[1]) <= max);            
            var salasOcupadas = filteredJson.map(room => room['Sala atribuida a aula']);
            filteredSalas = filteredSalas.filter(entry => !salasOcupadas.includes(entry['Nome sala']));

            if(filteredSalas.length > 0) {
                //PREFERÊNCIA SALAS
                var salaAlocada = filteredSalas[0];
                for(let pref = 0; pref < preferencias.length; pref ++) {
                    console.log(preferencias[pref]);
                    if(filteredSalas.filter(entry => entry[preferencias[pref]] == 1).length > 0) {
                        salaAlocada = filteredSalas.filter(entry => entry[preferencias[pref]] == 1)[0];
                        preferencia = preferencias[pref];
                    }
                }
                //console.log(semanaSemestre);
                const novaAula = criarDocumentoSlot(nomeCurso, UC, numeroAlunos, diaSemanaString, min, max, semanaSemestre, preferencia, salaAlocada);
                console.log(novaAula);
                exist = true;
            }
            horaCount++;
            semanaSemestre++;
        }     
    }
}

module.exports = {
    decimalParaHora: decimalParaHora,
    initParametrosSemana: initParametrosSemana,
    filterCapacidade : filterCapacidade,
    parseHour : parseHour,
    criarDocumentoSlot : criarDocumentoSlot,
    adicionarAulas : adicionarAulas,
};