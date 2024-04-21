

var jsonData;
var allAccepted;
const pathJsonSalas = "../Salas/CaracterizacaoDasSalas.json"; 
var minMaxFilterFunction = function (
  headerValue,
  rowValue,
  rowData,
  filterParams
) {
  // Aplica o filtro apenas a valores que não sejam null e que estejam definidos
  if (rowValue !== null && rowValue !== undefined) {
    if (headerValue.start !== "") {
      if (headerValue.end !== "") {
        // Filtro para valores de min e max definidos
        return (
          rowValue >= parseFloat(headerValue.start) &&
          rowValue <= parseFloat(headerValue.end)
        );
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
};

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
var cursoData = JSON.parse(localStorage.getItem('slotsData'));

document.addEventListener("DOMContentLoaded", function () {

  fetch("Horário.json")
    .then((response) => {
      // Verificar se o request foi bem sucedido
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${"../Horário.json"}: ${response.statusText}`
        );
      }

      // Parse the JSON data
      return response.json();
    })
    .then((data) => {
      horario = data;
      allAccepted = cursoData.length;
      horario = cursoData.concat(horario);

      table = new Tabulator("#tabela-dados", {
        height: "650px",
        layout: "fitDataFill",
        pagination: "local",
        resizableRows: true,
        movableColumns: true,
        data: horario,
        columns: [
          { title: "Curso", field: "Curso", headerFilter: "input" },
          { title: "UC", field: "UC", headerFilter: "input" },
          {
            title: "Turno",
            field: "Turno",
            headerFilter: "input",
            sorter: "alphanum",
          },
          { title: "Turma", field: "Turma", headerFilter: "input" },
          {
            title: "Nº alunos",
            field: "Inscritos no Turno",
            headerFilter: "input",
            sorter: "number",
            headerFilterLiveFilter: false,
            width: 95
          },
          {
            title: "Dia da Semana",
            field: "Dia da Semana",
            editor: "list",
            width: 100,
            headerFilter: true,
            headerFilterParams: {
              values: {
                Seg: "Segunda-feira",
                Ter: "Terça-feira",
                Qua: "Quarta-feira",
                Qui: "Quinta-feira",
                Sex: "Sexta-feira",
                Sab: "Sábado",
                Dom: "Domingo",
              },
            },
          },
          {
            title: "Hora de Início",
            field: "Hora Inicio da Aula",
            editor: "list",
            headerFilter: true,
            headerFilterParams: {
              values: {
                "08:00": "08:00",
                "08:30": "08:30",
                "09:00": "09:00",
                "09:30": "09:30",
                "10:00": "10:00",
                "10:30": "10:30",
                "11:00": "11:00",
                "11:30": "11:30",
                "12:00": "12:00",
                "12:30": "12:30",
                "13:00": "13:00",
                "13:30": "13:30",
                "14:00": "14:00",
                "14:30": "14:30",
                "15:00": "15:00",
                "15:30": "15:30",
                "16:00": "16:00",
                "16:30": "16:30",
                "17:00": "17:00",
                "17:30": "17:30",
                "18:00": "18:00",
                "18:30": "18:30",
                "19:00": "19:00",
                "19:30": "19:30",
                "20:00": "20:00",
                "20:30": "20:30",
                "21:00": "21:00",
                "21:30": "21:30",
              },
            },
          },
          {
            title: "Hora de Fim",
            field: "Hora Fim da Aula",
            editor: "list",
            headerFilter: true,
            headerFilterParams: {
              values: {
                "09:30": "09:30",
                "10:30": "10:30",
                "11:00": "11:00",
                "11:30": "11:30",
                "12:00": "12:00",
                "12:30": "12:30",
                "13:00": "13:00",
                "13:30": "13:30",
                "14:00": "14:00",
                "14:30": "14:30",
                "15:00": "15:00",
                "15:30": "15:30",
                "16:00": "16:00",
                "16:30": "16:30",
                "17:00": "17:00",
                "17:30": "17:30",
                "18:00": "18:00",
                "18:30": "18:30",
                "19:00": "19:00",
                "19:30": "19:30",
                "20:00": "20:00",
                "20:30": "20:30",
                "21:00": "21:00",
                "21:30": "21:30",
                "22:00": "22:00",
                "22:30": "22:30",
              },
            },
          },
          {
            title: "Data da aula",
            field: "Data da aula",
            headerFilter: "input",
            sorterParams: { format: "dd/MM/yy", alignEmptyValues: "top" },
          },
          {
            title: "Caracteristicas da sala",
            field: "Caracteristicas da sala pedida para a aula",
            headerFilter: "input",
          },
          {
            title: "Sala atribuida a aula",
            field: "Sala atribuida a aula",
            headerFilter: "input",
          },
          {
            title: "Semana do ano",
            field: "Semana do ano",
            headerFilter: "input",
          },
          {
            title: "Semana do semestre",
            field: "Semana do semestre",
            headerFilter: "input",
            width: 100
          },
          {
            title: "Alterar aula", field: "Alterar aula", headerSort: false,
            formatter: function (cell, formatterParams, onRendered) {
              var cursoData = JSON.parse(localStorage.getItem('slotsData'));
              // Verifica se o valor da célula corresponde a alguma UC em cursoData
              if (cursoData && cursoData.some(item => item.UC === cell.getRow().getData().UC)) {
                var acceptBtn = "<button class='accept-btn'>Aceitar</button>";
                var modifyBtn = "<button class='modify-btn'>Alterar</button>";
                var deleteBtn = "<button class='delete-btn'>Eliminar</button>";
                return acceptBtn + modifyBtn + deleteBtn;
              } else {
                return "";
              }
            },
            cellClick: function (e, cell) {
              if (e.target.classList.contains("accept-btn")) {
                var confirmacao = confirm("Tem a certeza que quer aceitar?");
                if (confirmacao) {
                  allAccepted -= 1;
                  cell.getElement().innerHTML = "";
                }
              } else if (e.target.classList.contains("modify-btn")) {
                  aulaAMudar = cell.getRow().getData();
                  $('#myModal').modal('show');
              } else if (e.target.classList.contains("delete-btn")) {
                var confirmacao = confirm("Tem a certeza que quer apagar a aula? Não há volta a dar depois se der merda já bateste");
                if (confirmacao) {
                  var rowData = cell.getRow().getData(); 
                  var rowIndex = cell.getRow().getIndex(); 
                  cell.getRow().delete(); 
                  cursoData.splice(rowIndex, 1);
                  localStorage.setItem('slotsData', JSON.stringify(cursoData)); 
                  alert("Aula excluída com sucesso!");
                }

              }
            },
          }
        ],
      });
    })
    .catch((error) => {
      console.error(`Error loading ${"../Horário.json"}:`, error);
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

  document.getElementById("gravarJSON").addEventListener("click", function () {
    if(allAccepted == 0) {
      var data = JSON.stringify(horario);
      var blob = new Blob([data], { type: "application/json" });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "SlotsAtribuidos.json";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });

  document.getElementById("gravarCSV").addEventListener("click", function () {
    if(allAccepted == 0) {
      var csvContent = convertJsonToCsv(horario);
      var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "SlotsAtribuidos.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
  document.getElementById("acceptAll").addEventListener("click", function () {
    var confirmacao = confirm("Tem a certeza que quer aceitar?");
                if (confirmacao) {
    table.getRows().forEach(function(row) {
        var cell = row.getCell("Alterar aula");
        cell.getElement().innerHTML = ""; 
    });
    allAccepted = 0; 
  }
});
});
