const pathJson = "../../../../../CaracterizacaoDasSalas.json";
const pathHorario = "../../../../../output.json";
var day_set = false;
var timeslot_set = false;
var day;
var timeslot;
let jsonHorario;
let jsonSalas;
var salasIndisponiveis = [];
var salasDisponiveis = [];

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
 * Obtém os dados do horário das aulas, através da leitura do ficheiro json
 * e guarda os dados na variável "jsonHorario"
 */
function readHorario() {
    fetch(pathHorario)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        jsonHorario = data;
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }

  /**
    * Obtém os dados das salas, através da leitura do ficheiro json
    * e guarda os dados na variável "jsonSalas"
    * 
   */
  function readSalas() {
    fetch(pathJson)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        jsonSalas = data;
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }

  /**
    * Filtra os dados do horário de aulas com base no dia e horário especificados.
    * @param {string} day O dia para o qual se deseja filtrar as informações.
    * @param {string} timeslot O horário para o qual se deseja filtrar as informações.
    * @returns {object[]} Uma lista de objetos contendo as informações filtradas.
   */
  function filterDate(day, timeslot) {
    return queryJSON(day, timeslot);
  }
  
  /**
    * Consulta o ficheiro JSON do horário para encontrar salas disponíveis com base na data e horário.
    * @param {Array} data Data pretendida.
    * @param {string} timeslot Horário pretendido.
    * @returns {Array} Uma matriz de nomes de salas disponíveis.
   */
  function queryJSON(data, timeslot) {
    for (let i = 0; i < jsonHorario.length; i++) {
      const currentDate = jsonHorario[i]["Data da aula"];
      const currentTimeslotInicio = jsonHorario[i]["Hora Inicio da Aula"];
      const currentTimeslotFim = jsonHorario[i]["Hora Fim da Aula"];
      const currentTimeSlot = currentTimeslotInicio + "-" + currentTimeslotFim;
      if ((currentDate == data && currentTimeSlot == timeslot)) {
        salasIndisponiveis.push(jsonHorario[i]["Sala atribuida a aula"]);
      }
    }
    for (let j = 0; j < jsonSalas.length; j++) {
      if (!salasIndisponiveis.includes(jsonSalas[j]["Nome sala"])) {
        salasDisponiveis.push(jsonSalas[j]["Nome sala"]);
      }
    }
    return salasDisponiveis;
  }

  /**
    * Formata uma data no formato 'YYYY-MM-DD' para o formato 'DD/MM/YYYY'.
    * @param {string} inputDate A data no formato 'YYYY-MM-DD'.
    * @returns {string} A data já formatada no formato 'DD/MM/YYYY'.
   */
  function formatDate(inputDate) {
    const parts = inputDate.split('-');
    const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;
    const year = formattedDate.getFullYear();
    const paddedDay = day < 10 ? '0' + day : day;
    const paddedMonth = month < 10 ? '0' + month : month;
    const formattedDateString = `${paddedDay}/${paddedMonth}/${year}`;
    return formattedDateString;
  }

  fetch(pathJson)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${pathJson}: ${response.statusText}`
        );
      }
      return response.json();
    })

    .then((data) => {
      var table = new Tabulator("#table-horario", {
        width: "1000",
        layout: "fitData",
        data: data,
        pagination: true,
        paginationSize: 20,
        columns: [
          { title: "Edifício", field: "Edifício", headerFilter: true },
          { title: "Nome sala", field: "Nome sala", headerFilter: true },
          {
            title: "Capacidade Normal",
            field: "Capacidade Normal",
            headerFilter: true,
            sorter: "number",
            headerFilter: minMaxFilterEditor,
            headerFilterFunc: minMaxFilterFunction,
            headerFilterLiveFilter: false,
          },
          {
            title: "Capacidade Exame",
            field: "Capacidade Exame",
            headerFilter: true,
            sorter: "number",
            headerFilter: minMaxFilterEditor,
            headerFilterFunc: minMaxFilterFunction,
            headerFilterLiveFilter: false,
          },
          {
            title: "Nº características",
            field: "Nº características",
            headerFilter: true,
          },
          {
            title: "Anfiteatro aulas",
            field: "Anfiteatro aulas",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Apoio técnico eventos",
            field: "Apoio técnico eventos",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 1",
            field: "Arq 1",
            headerFilter: true,
            formatter: "tickCross",
            sorter: "boolean",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 2",
            field: "Arq 2",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 3",
            field: "Arq 3",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 4",
            field: "Arq 4",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 5",
            field: "Arq 5",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 6",
            field: "Arq 6",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Arq 9",
            field: "Arq 9",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "BYOD (Bring Your Own Device)",
            field: "BYOD (Bring Your Own Device)",
            headerFilter: true,
            formatter: "tickCross",
            sorter: "boolean",
            editor: true,
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Focus Group",
            field: "Focus Group",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Arquictetura de Computadores I",
            field: "Laboratório de Arquictetura de Computadores I",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Arquictetura de Computadores II",
            field: "Laboratório de Arquictetura de Computadores II",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Base de Engenharia",
            field: "Laboratório de Base de Engenharia",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Eletrónica",
            field: "Laboratório de Eletrónica",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Informática",
            field: "Laboratório de Informática",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Jornalismo",
            field: "Laboratório de Jornalismo",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Redes de Computadores I",
            field: "Laboratório de Redes de Computadores I",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Redes de Computadores II",
            field: "Laboratório de Redes de Computadores II",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Laboratório de Telecomunicações",
            field: "Laboratório de Telecomunicações",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala Aulas Mestrado",
            field: "Sala Aulas Mestrado",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala Aulas Mestrado Plus",
            field: "Sala Aulas Mestrado Plus",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala NEE",
            field: "Sala NEE",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala Provas",
            field: "Sala Provas",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala Reunião",
            field: "Sala Reunião",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala de Arquitetura",
            field: "Sala de Arquitetura",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Sala de Aulas normal",
            field: "Sala de Aulas normal",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Videoconferência",
            field: "Videoconferência",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
          {
            title: "Átrio",
            field: "Átrio",
            headerFilter: true,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
          },
        ],
      });

      /**
        * Filtra as salas pelo edífico selecionado no início da página
        *
       */
      document
        .getElementById("location-filter")
        .addEventListener("change", function () {
          const selectedLocation = this.value;
          table.setFilter("Edifício", "like", selectedLocation);
        });

    /**
      * Remove o filtro do Edifício no casa de ter sido aplicado algum
      *
    */    
    document.getElementById("clear-filter").addEventListener("click", function () {
        document.getElementById("location-filter").value = ""; // Limpa o seletor de localização
        table.clearFilter();
      });

      /**
        * Esconde o botão "Filtrar por disponibilidade horária" e revela alguns filtros de datas e horários
        *
       */  
      document.getElementById("time-filter-button").addEventListener("click", function () {
        document.getElementById("select-timeslot").hidden = false;
        document.getElementById("data-horario").hidden = false;
        document.getElementById("time-filter-button").hidden = true;
        readHorario();
        readSalas();
      });

      /**
        * Filtra as salas por data
        *
       */  
      document.getElementById("data-horario").addEventListener("change", function () {
        day_set = true;
        day = formatDate(this.value);
        if (day_set && timeslot_set) {
          filter = filterDate(day, timeslot);
          table.setFilter("Nome sala", "in", filter);
        }
      });

      /**
        * Filtra as datas por horário (timeslot)
        *
       */  
      document.getElementById("select-timeslot").addEventListener("change", function () {
        timeslot = this.value;
        timeslot_set = true;
        if (day_set && timeslot_set) {
          filter = filterDate(day, timeslot);
          table.setFilter("Nome sala", "in", filter);
        }
      });
    })

    .catch((error) => {
      console.error(`Error loading ${pathJson}:`, error);
    });