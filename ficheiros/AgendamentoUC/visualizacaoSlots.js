var jsonData;
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
  
  fetch("../Horário.json")
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
      console.log(cursoData);
      console.log(horario);
      horario = cursoData.concat(horario);
      console.log(horario);

      table = new Tabulator("#tabela-dados", {
        height: "700px",
        layout: "fitDataTable",
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
            title: "Inscritos no Turno",
            field: "Inscritos no Turno",
            headerFilter: "input",
            sorter: "number",
            headerFilterLiveFilter: false,
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
            title: "Hora Início da Aula",
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
            title: "Hora Fim da Aula",
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
            title: "Caracteristicas da sala pedida para a aula",
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
          },
          { title: "Alterar aula", field: "Alterar aula", headerSort: false },
        ],
      });
    })
    .catch((error) => {
      console.error(`Error loading ${"../Horário.json"}:`, error);
    });

    document.getElementById("gravarJSON").addEventListener("click", function () {
        var data = JSON.stringify(horario);
        var blob = new Blob([data], { type: "application/json" });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "SlotsAtribuidos.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    
      document.getElementById("gravarCSV").addEventListener("click", function () {
        var csvContent = convertJsonToCsv(horario);
        var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "SlotsAtribuidos.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
});
