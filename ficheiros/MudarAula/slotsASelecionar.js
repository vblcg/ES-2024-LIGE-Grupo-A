var slots = JSON.parse(localStorage.getItem('slotsData'));
var aulaAnterior = JSON.parse(localStorage.getItem('aulaAMudar'));

let horario = [];

const pathJsonHorario = '../HorárioSlots/Horário.json';


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

var selcionarAula = function(cell, formatterParams, onRendered) {
    var button = document.createElement("button");
    button.innerHTML = "Selecionar aula";
    button.classList.add("selecionar-aula-button");
    button.addEventListener("click", function() {
        if (window.confirm("Este método é irreversível, deseja continuar?")) {
            // Eliminar o botão que permite selecionar o slot
            button.remove();
            var novaAula = cell.getRow().getData();
            delete novaAula['Selecionar aula'];
            fetch(pathJsonHorario)
            .then(response => response.json()) // Parse JSON response
            .then(data => {

                horario = data;

                horario.forEach((aula,index) => {
                    if(aula.Curso === aulaAnterior.Curso &&
                        aula.UC === aulaAnterior.UC &&
                        aula.Turno === aulaAnterior.Turno &&
                        aula.Turma === aulaAnterior.Turma &&
                        aula["Inscritos no Turno"] === aulaAnterior["Inscritos no Turno"] &&
                        aula["Dia da Semana"] === aulaAnterior["Dia da Semana"] &&
                        aula["Hora Inicio da Aula"] === aulaAnterior["Hora Inicio da Aula"] &&
                        aula["Hora Fim da Aula"] === aulaAnterior["Hora Fim da Aula"] &&
                        aula["Data da aula"] === aulaAnterior["Data da aula"] &&
                        aula["Semana do ano"] === aulaAnterior["Semana do ano"] &&
                        aula["Semana do semestre"] === aulaAnterior["Semana do semestre"] &&
                        aula["Caracteristicas da sala pedida para a aula"] === aulaAnterior["Caracteristicas da sala pedida para a aula"] &&
                        aula["Sala atribuida a aula"] === aulaAnterior["Sala atribuida a aula"]) {
                            horario.splice(index, 1);
                            horario.push(novaAula);
                        }

                });

                var data = JSON.stringify(horario);
                var blob = new Blob([data], { type: "application/json" });
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = url;
                a.download = "HorárioAlterado.json";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                var csvContent = convertJsonToCsv(horario);
                var blob1 = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
                var url1 = window.URL.createObjectURL(blob1);
                var a1 = document.createElement("a");
                a1.href = url1;
                a1.download = "HorárioAlterado.csv";
                document.body.appendChild(a1);
                a1.click();
                window.URL.revokeObjectURL(url1);
            
            })
            .catch(error => {
                console.error("Error fetching JSON:", error);
            });
        }
    });
        
    return button;
};


table = new Tabulator("#table-horario", {
height:"700px",
layout:"fitDataTable",
pagination:"local",
resizableRows: true,
movableColumns: true,
data: slots,
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
    {title: "Selecionar aula", field: "Selecionar aula", formatter: selcionarAula, headerSort:false}

],
}); 


function convertJsonToCsv(data) {
    var headers = Object.keys(data[0]);
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    data.forEach(function (row) {
      var values = headers.map(function (header) {
        return row[header];
      });
      csvContent += values.join(",") + "\n";
    });
  
    return csvContent;
  }

