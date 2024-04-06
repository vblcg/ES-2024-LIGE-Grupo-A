const pathJsonHorario = 'Horário.json';
const pathJsonSalas = 'CaracterizacaoDasSalas.json';
var table; // Declarar a variável da tabela
var salas;
var tiposDeSala;
var horario;
var aulaAMudar;
// Variável que contém todas as salas possíveis
var nomesSalas = [];
// Variável que vai guardar as salas ocupadas
// Variável que vai guardar as salas disponívies consoante as ocupadas
var salasDisponiveis = [];
var caracteristaDasSalas;
var salasPreferidas = [];
var salasInaceitaveisSelec = [];

 
 /**
  * Esconder e Mostrar colunas
  * @param {string} columnName Nome da coluna
*/
 function toggleColumn(columnName) {
    var column = table.getColumn(columnName);
    if (column) {
        column.toggle();
        adjustTableWidth();
    }
}

/**
  * Editor para o filtro de valores mínimo-máximo.
  * @param {CellComponent} cell O componente da célula.
  * @param {Function} onRendered Callback chamado quando o editor é renderizado.
  * @param {Function} success Callback chamado quando o valor do filtro é alterado com sucesso.
  * @param {Function} cancel Callback chamado quando a edição é cancelada.
  * @param {Object} editorParams Parâmetros adicionais do editor.
  * @returns {HTMLElement} O elemento HTML do editor.
*/
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 300);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    /**
      * Constroi os valores do start e do end do filtro minMax.
    */
    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }
    
     /**
      * Trata de eventos keypress para o editor.
      * @param {Event} e - Evento pressionado.
     */
    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
}

/**
  * Função de filtro para valores mínimo-máximo.
  * @param {Object} headerValue O valor do cabeçalho do filtro.
  * @param {any} rowValue O valor da célula da linha.
  * @param {Object} rowData Os dados da linha.
  * @param {Object} filterParams Parâmetros do filtro.
  * @returns {boolean} Retorna true se a linha corresponder ao filtro, caso contrário, retorna false.
*/
var minMaxFilterFunction = function (headerValue, rowValue, rowData, filterParams) {
    // Aplica o filtro apenas a valores que não sejam null e que estejam definidos
    if (rowValue !== null && rowValue !== undefined) {
        if (headerValue.start !== "") {
            if (headerValue.end !== "") {
                // Filtro para valores de min e max definidos
                return rowValue >= parseFloat(headerValue.start) && rowValue <= parseFloat(headerValue.end);
            } else {
                // Filtro se apenas o valor de min estiver difinido
                return rowValue >= parseFloat(headerValue.start);
            }
        } else {
            if (headerValue.end !== "") {
                // Filtro se apenas o valor de max estiver difinido
                return rowValue <= parseFloat(headerValue.end);
            }
        }
    }

    return true;
}

/**
* Adiciona o botão para alterar aula a cada linha e guarda os respetivos dados
* da linha na variável "aulaAMudar"
*/
var alterarAulaButton = function(cell, formatterParams, onRendered) {
    var button = document.createElement("button");
    button.innerHTML = "Alterar aula";
    button.classList.add("alterar-aula-button");
    button.addEventListener("click", function() {
        aulaAMudar = cell.getRow().getData();
        $('#myModal').modal('show');
    });
    return button;
};

/** 
  * Lê os dados do ficheiro json e cria uma tabela do tabulator com os mesmos
*/
fetch(pathJsonHorario)
.then(response => {
    // Verificar se o request foi bem sucedido
    if (!response.ok) {
        throw new Error(`Failed to fetch ${pathJsonHorario}: ${response.statusText}`);
    }

    // Parse the JSON data
    return response.json();
})

.then(data => {
    horario = data;

    table = new Tabulator("#table-horario", {
    height:"700px",
    layout:"fitDataTable",
    pagination:"local",
    resizableRows: true,
    movableColumns: true,
    data: data,
    columns: [
        {title: "Curso", field:"Curso", headerFilter: "input"},
        {title: "UC", field:"UC", headerFilter:"input"},
        {title: "Turno", field:"Turno", headerFilter:"input", sorter:"alphanum"},
        {title: "Turma", field:"Turma", headerFilter:"input"},
        {title: "Inscritos no Turno", field:"Inscritos no Turno", headerFilter:"input", sorter:"number",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false},
        {title: "Dia da Semana", field:"Dia da Semana", editor:"list", width:100 ,headerFilter:true, headerFilterParams:{values:{"Seg":"Segunda-feira", "Ter":"Terça-feira", "Qua":"Quarta-feira", "Qui":"Quinta-feira" ,"Sex":"Sexta-feira", "Sab":"Sábado", "Dom":"Domingo"}}},
        {title: "Hora Início da Aula", field:"Hora Inicio da Aula",editor:"list", headerFilter:true, headerFilterParams:{values:{"08:00":"08:00", "08:30":"08:30", "09:00":"09:00", "09:30":"09:30", "10:00":"10:00", "10:30":"10:30", "11:00":"11:00", "11:30":"11:30", "12:00":"12:00", "12:30":"12:30", "13:00":"13:00", "13:30":"13:30", "14:00":"14:00", "14:30":"14:30", "15:00":"15:00", "15:30":"15:30", "16:00":"16:00", "16:30":"16:30", "17:00":"17:00", "17:30":"17:30", "18:00":"18:00", "18:30":"18:30", "19:00":"19:00", "19:30":"19:30", "20:00":"20:00", "20:30":"20:30","21:00":"21:00", "21:30":"21:30"}}},
        {title: "Hora Fim da Aula", field:"Hora Fim da Aula", editor:"list", headerFilter:true, headerFilterParams:{values:{"09:30":"09:30", "10:30":"10:30", "11:00":"11:00", "11:30":"11:30" ,"12:00":"12:00", "12:30":"12:30", "13:00":"13:00", "13:30":"13:30", "14:00":"14:00", "14:30":"14:30", "15:00":"15:00", "15:30":"15:30", "16:00":"16:00", "16:30":"16:30", "17:00":"17:00", "17:30":"17:30", "18:00":"18:00", "18:30":"18:30", "19:00":"19:00","19:30":"19:30","20:00":"20:00", "20:30":"20:30", "21:00":"21:00", "21:30":"21:30", "22:00":"22:00", "22:30":"22:30"}}},
        {title: "Data da aula", field:"Data da aula", headerFilter:"input", sorterParams:{format:"dd/MM/yy", alignEmptyValues:"top"}},
        {title: "Caracteristicas da sala pedida para a aula", field:"Caracteristicas da sala pedida para a aula", headerFilter:"input"},
        {title: "Sala atribuida a aula", field:"Sala atribuida a aula", headerFilter:"input"},
        {title: "Semana do ano", field:"Semana do ano", headerFilter: "input"},
        {title: "Semana do semestre", field:"Semana do semestre", headerFilter:"input"},
        {title: "Alterar aula", field: "Alterar aula", formatter: alterarAulaButton, headerSort:false}

    ],
}); 

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('alterar-aula-button')) {
        $('#myModal').modal('show');
    }
});

})
.catch(error => {
    console.error(`Error loading ${pathJson}:`, error);
});

fetch(pathJsonSalas)
    .then(response => {
        // Verificar se o request foi bem sucedido
        if (!response.ok) {
            throw new Error(`Failed to fetch ${pathJsonSalas}: ${response.statusText}`);
        }

        // Parse the JSON data
        return response.json();
    })

    .then(data => {


        salas = data;
        nomesSalas = salas.map(sala => sala['Nome sala']);
        

        /**
         * Adiciona tanto os tipos de sala como as próprias salas, específicados no documento
         * json da caracterização das salas ao primeiro input de preferência de sala e de 
         * salas inaceitáveis.
        */
        function initializeSelectOptionsSalas() {
            tiposDeSala = Object.keys(salas[1]).slice(5);

            const preferenciaSala1 = document.getElementById('preferenciaSala1');
            const salasInaceitaveis = document.getElementById('salasInaceitaveis');

            // Adicionar cada tipo de sala existente aos respetivos inputs
            tiposDeSala.forEach(tipoDeSala => {
                const optionTipoSala = document.createElement('option');
                optionTipoSala.textContent = tipoDeSala;
                preferenciaSala1.appendChild(optionTipoSala);

                const OptionTipoSalaInaceitavel = document.createElement('option');
                OptionTipoSalaInaceitavel.textContent = tipoDeSala;
                salasInaceitaveis.appendChild(OptionTipoSalaInaceitavel);
            });

            
        }

    initializeSelectOptionsSalas();


    })
    .catch(error => {
        console.error(`Error loading ${pathJsonSalas}:`, error);
    });

    

    /**
     *  Adiciona um evento de click ao botão para adicionar mais uma preferência de sala e ao botão
     *  para adicionar mais uma sala inaceitável. Este evento adiciona mais um input de prefrência ou
     *  de sala inaceitável, consoante o botão clicado. Este input irá conter os tipos de sala e as
     *  salas existentes no ficheiro json da caracterização das salas.
     *  
    */
    document.addEventListener('DOMContentLoaded', function () {
        const addButton = document.getElementById('addPreferenceBtn');
        const addButtonSalasIn =  document.getElementById('addSalaInaceitavel');;

        const preferencesContainer = document.getElementById('preferencias-container');
        const inaceitavelCointainer = document.getElementById('salasInaceitaveis-container');

        let preferenceCount = 1;
        let inaceitavelCount = 1;

        addButton.addEventListener('click', function () {
            if(preferenceCount <= 2) {
                preferenceCount++;

                // Adiciona um novo input para as salas preferidas
                const preferenceDiv = document.createElement('div');
                preferenceDiv.classList.add('form-group');
                preferenceDiv.innerHTML = `
                    <p>Preferência nº${preferenceCount}:</p>
                    <select class="form-select" id="preferenciaSala${preferenceCount}" aria-label="Default select example">
                        <option selected>Escolha uma Preferência</option>
                    </select>
                `;

                preferencesContainer.appendChild(preferenceDiv);

                const novaPref = document.getElementById(`preferenciaSala${preferenceCount}`);

                // Adiciona as opções de tipo de sala ao novo input criado
                tiposDeSala.forEach(tipoDeSala => {
                    const optionTipoSala = document.createElement('option');
                    optionTipoSala.textContent = tipoDeSala;
                    novaPref.appendChild(optionTipoSala);
                })
            } else {
                alert('Não pode adicionar mais de 3 preferências');
            }
        });

        addButtonSalasIn.addEventListener('click', function () {
            if(inaceitavelCount <= 2) {
                inaceitavelCount++;

                // Adiciona um novo input para as salas inaceitáveis
                const inaceitavelDiv = document.createElement('div');
                inaceitavelDiv.classList.add('form-group');
                inaceitavelDiv.innerHTML = `
                    <p>Sala inaceitável nº${inaceitavelCount}:</p>
                    <select class="form-select" id="salaInaceitavel${inaceitavelCount}" aria-label="Default select example">
                        <option selected>Escolha uma sala inaceitável</option>
                    </select>
                `;

                inaceitavelCointainer.appendChild(inaceitavelDiv);

                const novaInaceitavel = document.getElementById(`salaInaceitavel${inaceitavelCount}`);

                // Adiciona as opções de tipo de sala ao novo input criado
                tiposDeSala.forEach(tipoDeSala => {
                    const optionTipoSala = document.createElement('option');
                    optionTipoSala.textContent = tipoDeSala;
                    novaInaceitavel.appendChild(optionTipoSala);
                })
            } else {
                alert('Não pode indicar mais de 3 salas salas inaceitáveis');
            }
        });
    });


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


    document.addEventListener('DOMContentLoaded', function () {
        const guardarButton = document.getElementById('guardarButton');

        guardarButton.addEventListener('click', function (event) {
            event.preventDefault(); 

            caracteristaDasSalas = salas;

            caracteristaDasSalas.forEach(function(obj) {
                delete obj["Edifício"];
                delete obj['Capacidade Normal'];
                delete obj['Nº características'];
                delete obj['Capacidade Exame'];
                delete obj['Capacidade Normal'];
            });


            var curso = aulaAMudar['Curso'];
            var uc = aulaAMudar['UC'];

            var semanaPrefValue = document.getElementById('semanaPref').value;
            var diaDaSemanaPrefValue = document.getElementById('diaDaSemanaPref').value;
            var alturaDoDiaPrefValue = document.getElementById('alturaDoDiaPref').value;
            var preferenciaSala1Value = document.getElementById('preferenciaSala1').value;
            var salasInaceitaveisValue = document.getElementById('salasInaceitaveis').value;

            var [startHour, endHour] = alturaDoDiaPrefValue.split(',');

    

            // Obrigar o utilizador a preencher os 3 primeiros inputs
            if (semanaPrefValue === 'semana a selecionar' || diaDaSemanaPrefValue === 'dia da semana a selecionar' || alturaDoDiaPrefValue.value === 'altura do dia a selecionar') {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
          

            var salasOcupadas = [];


            horario.forEach(function (item) {

                var semanaSemestre = item['Semana do semestre'];
                var diaDaSemana = item['Dia da Semana'];
                var caracteristicasSala = item['Caracteristicas da sala pedida para a aula'];
                var salaAtribuida = item['Caracteristicas da sala pedida para a aula'];
                var dataAula = item['Data da aula'];
                //var ano = parseInt((new Date(dataAula)).getFullYear());

                //var anoAtual = 2023;

                var startTime = parseFloat(item['Hora Inicio da Aula'].replace(':', '.'));
                var endTime = parseFloat(item['Hora Fim da Aula'].replace(':', '.'));

                

                // Condição quando o utilizador indica os inputs obrigatórios e o de preferências
                if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue === "Indique as salas inaceitáveis"){
                    var condicaoComPrefSemIna = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour && salaAtribuida.includes(preferenciaSala1Value);
                    if (condicaoComPrefSemIna) {
                        salasOcupadas.push(item['Sala atribuida a aula']);
                        salasOcupadas = [...new Set(salasOcupadas)];
                    }


                // Condição quando o utilizador indica os inputs obrigatórios e o das Salas Inaceitáveis
                } else if(preferenciaSala1Value === "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis") {
                    var condicaoSemPreComIna = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour && !salaAtribuida.includes(salasInaceitaveisValue);
                    if (condicaoSemPreComIna) {
                        salasOcupadas.push(item['Sala atribuida a aula']);
                    }

                // Condição quando o utilizador indica os inputs obrigatórios, o de salas preferidas e salas inaceitáveis
                } else if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis"){
                    var condicaoTotal = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour && !salaAtribuida.includes(salasInaceitaveisValue) && salaAtribuida.includes(preferenciaSala1Value);
                    if (condicaoTotal) {
                        salasOcupadas.push(item['Sala atribuida a aula']);
                    }

                    // Condição quando o utilizador apenas indica os inputs obrigatórios
                } else{
                    var condicaoObrigatoria = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour;
                    if (condicaoObrigatoria) {
                        salasOcupadas.push(item['Sala atribuida a aula']);
                    }

                    
                }
                
            });

            // Tornar as salas ocupadas num array com valores únicos
            salasOcupadas = [...new Set(salasOcupadas)];

            // Condição quando o utilizador indica os inputs obrigatórios e o de preferências
            if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue === "Indique as salas inaceitáveis"){
            caracteristaDasSalas.forEach(function(item) {
                var condicao = item[preferenciaSala1Value] === 1;
                if (condicao){
                    salasPreferidas.push(item['Nome sala']);
                }
            });

            salasDisponiveis = salasPreferidas.filter(function(sala) {
                return !salasOcupadas.includes(sala);
            });

            // Condição quando o utilizador indica os inputs obrigatórios e o das Salas Inaceitáveis
            } else if(preferenciaSala1Value === "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis") {
            caracteristaDasSalas.forEach(function(item) {
                var condicao = item[salasInaceitaveisValue] === 1;
                if (condicao){
                    salasInaceitaveisSelec.push(item['Nome sala']);
                }
            });

            salasDisponiveis = nomesSalas.filter(function(sala) {
                return !salasOcupadas.includes(sala) && !salasInaceitaveisSelec.includes(sala);
            });

            // Condição quando o utilizador indica os inputs obrigatórios, o de salas preferidas e salas inaceitáveis
            } else if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis"){

            caracteristaDasSalas.forEach(function(item) {
                var condicao1 = item[preferenciaSala1Value] === 1;
                var condicao2 = item[salasInaceitaveisValue] === 1;
                if (condicao1){
                    salasPreferidas.push(item['Nome sala']);
                } 
                if (condicao2){
                    salasInaceitaveisSelec.push(item['Nome sala']);
                }
            });

            salasDisponiveis = salasPreferidas.filter(function(sala) {
                return !salasOcupadas.includes(sala);
            });


            // No caso de nenhuma das salas preferidas estar disponível
            if (salasDisponiveis.length === 0) {
                salasDisponiveis = nomesSalas.filter(function(sala) {
                    return !salasOcupadas.includes(sala) && !salasInaceitaveisSelec.includes(sala);
                });
            }

            // Condição quando o utilizador apenas indica os inputs obrigatórios
            } else {
            // Obter todas as salas que estão disponíveis (todas menos as ocupadas)
            salasDisponiveis = nomesSalas.filter(nomeSala => !salasOcupadas.includes(nomeSala));
            }

            console.log(salasDisponiveis); 

        });
    });