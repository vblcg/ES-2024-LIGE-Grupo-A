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

/**
     * Obtém as características de uma determinada sala.
     * @param {string} nomeSala - O nome da sala para obter as características.
     * @returns {Array<string>} - Um array com as características da sala.
     */
function getCaracteristica(nomeSala){
    var caracteristica = [];
    caracteristaDasSalas.forEach(room => {
        if(room['Nome sala'] === nomeSala){
            for (const prop in room) {
                if (room.hasOwnProperty(prop) && room[prop] === 1) {
                    caracteristica.push(prop);
                }
            }
        }
    })

    return caracteristica;
}

/**
     * Gera slots com base nas característas das aulas e salas disponíveis.
     * @param {Array} array - Array com as caracteristicas da sala
     * @param {Array} salasAvailableInput - Array de salas disponíveis com os respetivos horários disponíveis.
     * @returns {Array} - Slots disponíveis para o utilizador escolher
     */
function generateSlots(array, salasAvailableInput){
        
    const slots = [];
    salasAvailableInput.forEach(aula => {
        console.log(aula);
        const vetor = [];
        vetor.push(array[0]); //curso
        vetor.push(array[1]); //uc
        vetor.push(array[2]); //turno
        vetor.push(array[3]); //turma
        vetor.push(array[4]); //inscritos no turno
        vetor.push(array[5]); //dia da semana 
        vetor.push(aula.HoraInicio);
        vetor.push(aula.horaFim);
        // Calcular a data da nova aula
        const dataAula = getDateFunc(array[6],array[5], getSemesterFromDate(array[7])); //semana pref; dia da semana; data antiga 
        vetor.push(dataAula);
        // Verificar se o utilizador específicou as características da sala
        caracteristica = aula['caracteristica'];
        if(caracteristica == undefined){
            vetor.push(getCaracteristica(aula.sala))
        } else {
            vetor.push(caracteristica);
        }
        
        vetor.push(aula.sala);
        vetor.push(getWeekOfYear(dataAula));
        vetor.push(array[6]);

        var slot = createJsonEntry(vetor);

        slots.push(slot);

    })

    return slots;
}

/**
     * Função que calcula a semana do ano com base numa data.
     * @param {string} data - Data da aula.
     * @returns {number} Semana do ano correspondente à data fornecida.
     */
function getWeekOfYear(data) {
    const dateParts = data.split('/');

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is zero-based
    const day = parseInt(dateParts[2]);

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
        return -1;
    }

    const inicioAno = new Date(year, 0, 1);
    const diff = date - inicioAno;
    const semanaAno = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));

    return semanaAno + 1;
}

/**
     * Função que calcula o semestre com base na data da aula a substituir.
     * @param {String} date - Data da aula a substituir.
     * @returns {string} O semestre correspondente à data fornecida ("first" para o primeiro semestre ou "second" para o segundo semestre).
     */
function getSemesterFromDate(date) {
    let newDate;
    if(date == null){
        newDate = new Date();
    } else {
        const dateParts = date.split('/');
    newDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);
    }
    const referenceDateFirstSemester = new Date('2022-09-01');
    const referenceDateSecondSemester = new Date('2023-02-01');

    if (newDate >= referenceDateFirstSemester && newDate < referenceDateSecondSemester) {
        return "first";
    } else {
        return "second";
    }
}

/**
     * Calcula a data da nova aula com base no número da semana, dia da semana e semestre.
     * @param {number} weekNumber - Número da semana.
     * @param {string} dayOfWeek - Dia da semana.
     * @param {string} semester - O semestre ("first" para o primeiro semestre ou "second" para o segundo semestre).
     * @returns {string} A data da nova aula.
     */
function getDateFunc(weekNumber, dayOfWeek, semester) {
    const weekDays = {
        "Seg": 1,
        "Ter": 2,
        "Qua": 3,
        "Qui": 4,
        "Sex": 5
    };

    let referenceDate;
    if (semester === 'first') {
        referenceDate = new Date('2022-09-01');
    } else if (semester === 'second') {
        referenceDate = new Date('2023-02-01');
    } else {
        return null; // Invalid semester input
    }

    const resultDate = new Date(referenceDate);
    resultDate.setDate(resultDate.getDate() + (weekNumber - 1) * 7);

    const day = weekDays[dayOfWeek];
    if (!day) {
        return null; // Invalid day of the week input
    }

    resultDate.setDate(resultDate.getDate() + (day - resultDate.getDay() + 7) % 7);

    const year = resultDate.getFullYear();
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(resultDate.getDate()).padStart(2, '0');

    return `${year}/${month}/${dayOfMonth}`;
}

module.exports = {
    checkIfEmpty : checkIfEmpty,
    createJsonEntry : createJsonEntry,
    getCaracteristica : getCaracteristica,
    generateSlots : generateSlots,
    getWeekOfYear : getWeekOfYear,
    getSemesterFromDate : getSemesterFromDate,
    getDateFunc : getDateFunc,
};