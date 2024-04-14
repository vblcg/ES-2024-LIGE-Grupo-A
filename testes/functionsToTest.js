let horario = [{
    "Curso": "ME",
    "UC": "Teoria dos Jogos e dos Contratos",
    "Turno": "01789TP01",
    "Turma": "MEA1",
    "Inscritos no Turno": "30",
    "Dia da Semana": "Sex",
    "Hora Inicio da Aula": "13:00:00",
    "Hora Fim da Aula": "14:30:00",
    "Data da aula": "2022/12/02",
    "Semana do ano": 48,
    "Semana do semestre": 13,
    "Caracteristicas da sala pedida para a aula": "Sala Aulas Mestrado",
    "Sala atribuida a aula": "AA2.25"
  },{
    "Curso": "LGRH",
    "UC": "Comunica��o Organizacional",
    "Turno": "02430TP02",
    "Turma": "GRHC2",
    "Inscritos no Turno": "29",
    "Dia da Semana": "Sex",
    "Hora Inicio da Aula": "09:30:00",
    "Hora Fim da Aula": "11:00:00",
    "Data da aula": "2022/10/07",
    "Semana do ano": 40,
    "Semana do semestre": 5,
    "Caracteristicas da sala pedida para a aula": "Sala de Aulas normal",
    "Sala atribuida a aula": ""
},]

  let salas = [
    {
      "Edifício": "Ala Autónoma (ISCTE-IUL)",
      "Nome sala": "Auditório Afonso de Barros",
      "Capacidade Normal": "80",
      "Capacidade Exame": "39",
      "Nº características": "4",
      "Anfiteatro aulas": "",
      "Apoio técnico eventos": "",
      "Arq 1": "",
      "Arq 2": "",
      "Arq 3": "",
      "Arq 4": "",
      "Arq 5": "",
      "Arq 6": "",
      "Arq 9": "",
      "BYOD (Bring Your Own Device)": "",
      "Focus Group": "",
      "Horário sala visível portal público": 1,
      "Laboratório de Arquictetura de Computadores I": "",
      "Laboratório de Arquictetura de Computadores II": "",
      "Laboratório de Base de Engenharia": "",
      "Laboratório de Eletrónica": "",
      "Laboratório de Informática": "",
      "Laboratório de Jornalismo": "",
      "Laboratório de Redes de Computadores I": "",
      "Laboratório de Redes de Computadores II": "",
      "Laboratório de Telecomunicações": "",
      "Sala Aulas Mestrado": 1,
      "Sala Aulas Mestrado Plus": 1,
      "Sala NEE": "",
      "Sala Provas": "",
      "Sala Reunião": "",
      "Sala de Arquitetura": "",
      "Sala de Aulas normal": 1,
      "Videoconferência": "",
      "Átrio": ""
    },
    {
      "Edifício": "Ala Autónoma (ISCTE-IUL)",
      "Nome sala": "Auditório Silva Leal",
      "Capacidade Normal": "54",
      "Capacidade Exame": "27",
      "Nº características": "4",
      "Anfiteatro aulas": "",
      "Apoio técnico eventos": "",
      "Arq 1": "",
      "Arq 2": "",
      "Arq 3": "",
      "Arq 4": "",
      "Arq 5": "",
      "Arq 6": "",
      "Arq 9": "",
      "BYOD (Bring Your Own Device)": "",
      "Focus Group": "",
      "Horário sala visível portal público": 1,
      "Laboratório de Arquictetura de Computadores I": "",
      "Laboratório de Arquictetura de Computadores II": "",
      "Laboratório de Base de Engenharia": "",
      "Laboratório de Eletrónica": "",
      "Laboratório de Informática": "",
      "Laboratório de Jornalismo": "",
      "Laboratório de Redes de Computadores I": "",
      "Laboratório de Redes de Computadores II": "",
      "Laboratório de Telecomunicações": "",
      "Sala Aulas Mestrado": 1,
      "Sala Aulas Mestrado Plus": 1,
      "Sala NEE": "",
      "Sala Provas": "",
      "Sala Reunião": "",
      "Sala de Arquitetura": "",
      "Sala de Aulas normal": 1,
      "Videoconferência": "",
      "Átrio": ""
    },
    {
      "Edifício": "Ala Autónoma (ISCTE-IUL)",
      "Nome sala": "AA2.23",
      "Capacidade Normal": "50",
      "Capacidade Exame": "23",
      "Nº características": "5",
      "Anfiteatro aulas": "",
      "Apoio técnico eventos": "",
      "Arq 1": "",
      "Arq 2": "",
      "Arq 3": "",
      "Arq 4": "",
      "Arq 5": "",
      "Arq 6": "",
      "Arq 9": "",
      "BYOD (Bring Your Own Device)": "",
      "Focus Group": "",
      "Horário sala visível portal público": 1,
      "Laboratório de Arquictetura de Computadores I": "",
      "Laboratório de Arquictetura de Computadores II": "",
      "Laboratório de Base de Engenharia": "",
      "Laboratório de Eletrónica": "",
      "Laboratório de Informática": "",
      "Laboratório de Jornalismo": "",
      "Laboratório de Redes de Computadores I": "",
      "Laboratório de Redes de Computadores II": "",
      "Laboratório de Telecomunicações": "",
      "Sala Aulas Mestrado": 1,
      "Sala Aulas Mestrado Plus": 1,
      "Sala NEE": "",
      "Sala Provas": "",
      "Sala Reunião": "",
      "Sala de Arquitetura": "",
      "Sala de Aulas normal": 1,
      "Videoconferência": "",
      "Átrio": ""
},]

/**
     * 
     * @param {*} decimal 
     * @returns 
     * Função para usar somas de horas. Ex: 9.30 + 1.30 daria 10.60, mas pretende-se que dê 11. A função trata disso. 
*/
function decimalParaHora(decimal) {
    let horaInteira = Math.floor(decimal);
    let minutos = Math.round((decimal - horaInteira)*100)/100;
    if(minutos == 0.6) return Math.round(decimal); else return decimal;
}

/**
 * 
 * @param  diasSemanaInput 
 * @returns 
 * Inicializa os parâmetros referentes à semana, essenciais ao funcionamento da lógica de 
 * atribuição de aulas. 
 * 
 */
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

/**
 * 
 * @param {*} salas 
 * @param {*} numeroAlunos 
 * @returns 
 * Filtra as salas pela capacidade dada pelo utilizador, ficando apenas as que têm capacidade superior à dada.
 */
function filterCapacidade(salas, numeroAlunos) {
    if(numeroAlunos != null) {
        return salas.filter(entry => parseFloat(entry['Capacidade Normal']) >= numeroAlunos);
    } else {
        return salas;
    }
}

/**
 * @param hour
 * Função para passar do formato "hh.mm" para o formato "hh:mm:ss".
 */
function parseHour(hour) {
    if(hour.toString().includes("."))
        return hour.toString().replace(".", ":") + "0:00";
    else if(hour.toString().includes(":"))
        return hour.toString() + "0:00";
    else 
        return hour.toString() + ":00:00";
}

/**
 * 
 * @param {*} nomeCurso 
 * @param {*} UC 
 * @param {*} numeroAlunos 
 * @param {*} diaSemanaString 
 * @param {*} min 
 * @param {*} max 
 * @param {*} semanaSemestre 
 * @param {*} preferencia 
 * @param {*} salaAlocada 
 * @returns 
 * 
 * Criação de documento JSON referente ao novo slot atribuído ao utilizador.
 */
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


/**
 * 
 * @param {*} inputs 
 * Lógica de atribuição de slots, com aplicação de funções de filtragem de salas e slots horários, 
 * dependendo do input do utilizador.
 */
function adicionarAulas(inputs) {
    let filteredJson = horario;
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
                throw new Error("Não há slots suficientes para as condições pedidas. Tente novamente.");
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
                        throw new Error("Não há slots suficientes para as condições pedidas. Tente novamente.");
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
                        throw new Error("Não há slots suficientes para as condições pedidas. Tente novamente.");
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
            filteredJson = horario.filter(entry => diaSemanaString == entry['Dia da Semana']);
            
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

