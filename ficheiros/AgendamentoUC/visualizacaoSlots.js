
let salas;
var jsonData;
var allAccepted;
const pathJsonSalas = "./CaracterizacaoDasSalas.json"; 

let guardarButtonListenerAttached = false;

document.addEventListener('click', function () {
    if (!guardarButtonListenerAttached) {
        const guardarButton = document.getElementById('guardarButton');
        
        guardarButton.addEventListener('click', function (event) {
            event.preventDefault(); 
            getPreferences(horario);
        });
        
        guardarButtonListenerAttached = true;
    }
});

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

/**
     *  Adiciona um evento de click ao botão para adicionar mais uma preferência de sala e ao botão
     *  para adicionar mais uma sala inaceitável. Este evento adiciona mais um input de prefrência ou
     *  de sala inaceitável, consoante o botão clicado. Este input irá conter os tipos de sala e as
     *  salas existentes no ficheiro json da caracterização das salas.
     *  
    */
document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.getElementById('addPreferenceBtn');
  //const addButtonSalasIn =  document.getElementById('addSalaInaceitavel');;

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


});


var cursoData = JSON.parse(localStorage.getItem('slotsData'));

document.addEventListener("DOMContentLoaded", function () {

  fetch("Horário.json")
    .then((response) => {
      // Verificar se o request foi bem sucedido
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${"./Horário.json"}: ${response.statusText}`
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
                Sáb: "Sábado",
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
                var confirmacao = confirm("Tem a certeza que quer apagar a aula?");
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
      console.error(`Error loading ${"./Horário.json"}:`, error);
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
});


var tiposDeSala;
var aulaAMudar;
// Variável que contém todas as salas possíveis
var nomesSalas = [];
// Variável que vai guardar as salas ocupadas
// Variável que vai guardar as salas disponívies consoante as ocupadas
var salasDisponiveis = [];
var caracteristaDasSalas;
var salasPreferidas = [];
var salasInaceitaveisSelec = [];

// Variável que vai ter as salas disponíveis com os respetivos horários
let salasAvailable = [];

/**
     * Função que analisa as opções do utilizador, e em conjunto com outras funções
     * cria a variável com os slots disponíveis para o utilizador escolher e redireciona
     * para a página de escolha dos mesmos.
     */
function getPreferences(horario){


  let filteredSalasAvailable = [];

  caracteristaDasSalas = salas;

  caracteristaDasSalas.forEach(function(obj) {
      delete obj["Edifício"];
      delete obj['Nº características'];
      delete obj['Capacidade Exame'];
      delete obj['Horário sala visível portal público'];
  });


  var curso = aulaAMudar['Curso'];
  var uc = aulaAMudar['UC'];
  var turno = aulaAMudar['Turno'];
  var turma = aulaAMudar['Turma'];
  var inscritos_no_turno = aulaAMudar['Inscritos no Turno'];
  var dataAntiga = aulaAMudar['Data da aula'];

  var arrayParaFunc = [];
  arrayParaFunc.push(curso);
  arrayParaFunc.push(uc);
  arrayParaFunc.push(turno);
  arrayParaFunc.push(turma);
  arrayParaFunc.push(inscritos_no_turno);



  var semanaPrefValue = document.getElementById('semanaPref').value;
  var diaDaSemanaPrefValue = document.getElementById('diaDaSemanaPref').value;
  var alturaDoDiaPrefValue = document.getElementById('alturaDoDiaPref').value;
  var preferenciaSala1Value = document.getElementById('preferenciaSala1').value;
  var salasInaceitaveisValue = document.getElementById('salasInaceitaveis').value;

  let preferenciaSala2Value;
  let preferenciaSala3Value;


  if(checkContainerLength('preferencias-container') - 1 === 2){
      preferenciaSala2Value = document.getElementById('preferenciaSala2').value;
  } else if(checkContainerLength('preferencias-container') - 1 === 3){
      preferenciaSala2Value = document.getElementById('preferenciaSala2').value;
      preferenciaSala3Value = document.getElementById('preferenciaSala3').value;
  }

  var [startHour, endHour] = alturaDoDiaPrefValue.split(',');


  arrayParaFunc.push(diaDaSemanaPrefValue);
  arrayParaFunc.push(semanaPrefValue);
  arrayParaFunc.push(dataAntiga);



  // Obrigar o utilizador a preencher os 3 primeiros inputs
  if (semanaPrefValue === 'Semana a selecionar' || diaDaSemanaPrefValue === 'Dia da semana a selecionar' || alturaDoDiaPrefValue.value === 'Altura do dia a selecionar') {
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
          if (condicaoComPrefSemIna && item['Sala atribuida a aula'] !== '') {
              salasOcupadas.push({
                  sala: item['Sala atribuida a aula'],
                  HoraInicio: item['Hora Inicio da Aula'],
                  horaFim: item['Hora Fim da Aula'],
              });
          }


      // Condição quando o utilizador indica os inputs obrigatórios e o das Salas Inaceitáveis
      } else if(preferenciaSala1Value === "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis") {
          var condicaoSemPreComIna = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour && !salaAtribuida.includes(salasInaceitaveisValue);
          if (condicaoSemPreComIna && item['Sala atribuida a aula'] !== '') {
              salasOcupadas.push({
                  sala: item['Sala atribuida a aula'],
                  HoraInicio: item['Hora Inicio da Aula'],
                  horaFim: item['Hora Fim da Aula']
              });
          }

      // Condição quando o utilizador indica os inputs obrigatórios, o de salas preferidas e salas inaceitáveis
      } else if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis"){
          
          var condicaoTotal = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour && !salaAtribuida.includes(salasInaceitaveisValue) && salaAtribuida.includes(preferenciaSala1Value);
          if (condicaoTotal && item['Sala atribuida a aula'] !== '') {
              salasOcupadas.push({
                  sala: item['Sala atribuida a aula'],
                  HoraInicio: item['Hora Inicio da Aula'],
                  horaFim: item['Hora Fim da Aula']
              });
          }

          // Condição quando o utilizador apenas indica os inputs obrigatórios
      } else {
          var condicaoObrigatoria = diaDaSemana.includes(diaDaSemanaPrefValue) && semanaSemestre == semanaPrefValue && startTime >= startHour && endTime <= endHour;
          if (condicaoObrigatoria && item['Sala atribuida a aula'] !== '') {
              salasOcupadas.push({
                  sala: item['Sala atribuida a aula'],
                  HoraInicio: item['Hora Inicio da Aula'],
                  horaFim: item['Hora Fim da Aula']
              });
          }

          
      }
      
    });


  const aggregatedsalasOcupadas = {};

  salasOcupadas.forEach(row => {
      // Verificar se a sala já existe no array "aggregatedsalasOcupadas"
      if (!(row.sala in aggregatedsalasOcupadas)) {
          // Se a sala não existir no "aggregatedsalasOcupadas", adiconá-la com os valores atuais
          aggregatedsalasOcupadas[row.sala] = {
              sala: row.sala,
              HoraInicio: [row.HoraInicio],
              horaFim: [row.horaFim] 
          };
      } else {
          // Se a sala já existir, adicionar a HoraInicio e horaFim atual aos respetivos arrays
          aggregatedsalasOcupadas[row.sala].HoraInicio.push(row.HoraInicio);
          aggregatedsalasOcupadas[row.sala].horaFim.push(row.horaFim);
      }
  });

  // Array que vai conter uma lista da sala, com os horários em que está ocupada
  const aggregatedsalasOcupadasArray = Object.values(aggregatedsalasOcupadas);



  aggregatedsalasOcupadasArray.forEach(room => {
      const horaInicioArray = room.HoraInicio;
      // Manhã
      if(startHour == 8 && endHour == 13){
          if (!horaInicioArray.includes('08:00:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '08:00:00',
                  horaFim: '09:30:00'
              })
          }
          if (!horaInicioArray.includes('09:30:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '09:30:00',
                  horaFim: '11:00:00'
              })
          }
          if (!horaInicioArray.includes('11:00:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '11:00:00',
                  horaFim: '12:30:00'
              })

          }
      }
      if(startHour == 13 && endHour == 18){
          if (!horaInicioArray.includes('13:00:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '13:00:00',
                  horaFim: '14:30:00'
              })
          }
          if (!horaInicioArray.includes('14:30:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '14:30:00',
                  horaFim: '16:00:00'
              })
          }
          if (!horaInicioArray.includes('16:00:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '16:00:00',
                  horaFim: '17:30:00'
              })
          }
      }

      if(startHour == 18 && endHour == 23){
          if (!horaInicioArray.includes('18:00:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '18:00:00',
                  horaFim: '19:30:00'
              })
          }
          if (!horaInicioArray.includes('19:30:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '19:30:00',
                  horaFim: '21:00:00'
              })
          }
          if (!horaInicioArray.includes('21:00:00')) {
              salasAvailable.push({
                  sala: room.sala,
                  HoraInicio: '21:00:00',
                  horaFim: '22:30:00'
              })
          }
      }
    });



  
  // Condição quando o utilizador indica os inputs obrigatórios e o de preferências
  if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue === "Indique as salas inaceitáveis"){
        caracteristaDasSalas.forEach(function(item) {
            var condicao = item[preferenciaSala1Value] === 1 && item['Capacidade Normal'] >= inscritos_no_turno && !(item['Nome sala'] in aggregatedsalasOcupadas);

            if (condicao){
                salasPreferidas.push(item['Nome sala']);
            }

            salasPreferidas.forEach(room => {
                if(!salasAvailable.some(record => record.sala === room)){
                    if(startHour == 8 && endHour == 13){
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '08:00:00',
                            horaFim: '09:30:00'
                        })
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '09:30:00',
                            horaFim: '11:00:00'
                        })
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '11:00:00',
                            horaFim: '12:30:00',
                            caracteristica: ""
                        })
                    } else if (startHour == 13 && endHour == 18){
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '13:00:00',
                            horaFim: '14:30:00'
                        })
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '14:30:00',
                            horaFim: '16:00:00'
                        })
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '16:00:00',
                            horaFim: '17:30:00'
                        })
                        
                    } else if(startHour == 18 && endHour == 23) {
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '18:00:00',
                            horaFim: '19:30:00'
                        })
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '19:30:00',
                            horaFim: '21:00:00'
                        })
                        salasAvailable.push({
                            sala: room,
                            HoraInicio: '21:00:00',
                            horaFim: '22:30:00'
                        })
                    }
                }

            });

        });



        if(salasAvailable.length !== 0){
            salasAvailable.forEach(sala => {
            sala['caracteristica'] = preferenciaSala1Value;
            });
        }
        

        if(salasAvailable.length === 0 && preferenciaSala2Value !== undefined){
            caracteristaDasSalas.forEach(function(item) {

                var condicao2 = item[preferenciaSala2Value] === 1 && item['Capacidade Normal'] >= inscritos_no_turno && !(item['Nome sala'] in aggregatedsalasOcupadas); 

                if (condicao2){
                    salasPreferidas.push(item['Nome sala']);
                }

                salasPreferidas.forEach(room => {
                    if(!salasAvailable.some(record => record.sala === room)){
                        if(startHour == 8 && endHour == 13){
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '08:00:00',
                                horaFim: '09:30:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '09:30:00',
                                horaFim: '11:00:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '11:00:00',
                                horaFim: '12:30:00'
                            })
                        } else if (startHour == 13 && endHour == 18){
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '13:00:00',
                                horaFim: '14:30:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '14:30:00',
                                horaFim: '16:00:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '16:00:00',
                                horaFim: '17:30:00'
                            })
                            
                        } else if(startHour == 18 && endHour == 23) {
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '18:00:00',
                                horaFim: '19:30:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '19:30:00',
                                horaFim: '21:00:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '21:00:00',
                                horaFim: '22:30:00'
                            })
                        }
                    }
    
                });

            });

            if(salasAvailable.length !== 0){
                salasAvailable.forEach(sala => {
                    sala['caracteristica'] = preferenciaSala2Value;
                })
            }
    

        }
        

        

        if(salasAvailable.length === 0 && preferenciaSala3Value !== undefined){
            caracteristaDasSalas.forEach(function(item) {


                var condicao3 = item[preferenciaSala3Value] === 1 && item['Capacidade Normal'] >= inscritos_no_turno && !(item['Nome sala'] in aggregatedsalasOcupadas); 

                if (condicao3){
                    salasPreferidas.push(item['Nome sala']);
                }

                salasPreferidas.forEach(room => {
                    if(!salasAvailable.some(record => record.sala === room)){
                        if(startHour == 8 && endHour == 13){
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '08:00:00',
                                horaFim: '09:30:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '09:30:00',
                                horaFim: '11:00:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '11:00:00',
                                horaFim: '12:30:00'
                            })
                        } else if (startHour == 13 && endHour == 18){
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '13:00:00',
                                horaFim: '14:30:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '14:30:00',
                                horaFim: '16:00:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '16:00:00',
                                horaFim: '17:30:00'
                            })
                            
                        } else if(startHour == 18 && endHour == 23) {
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '18:00:00',
                                horaFim: '19:30:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '19:30:00',
                                horaFim: '21:00:00'
                            })
                            salasAvailable.push({
                                sala: room,
                                HoraInicio: '21:00:00',
                                horaFim: '22:30:00'
                            })
                        }
                    }
    
                });
            });

            if(salasAvailable.length !== 0) {
                salasAvailable.forEach(sala => {
                    sala['caracteristica'] = preferenciaSala3Value;
                })
            }

        }

        if (salasAvailable.length === 0) {
            alert("Não exite nenhum slot disponível para as preferências indicadas");
            return;
        }

        filteredSalasAvailable = salasAvailable.filter(sala => {
            let salaInfo = caracteristaDasSalas.find(item => item['Nome sala'] == sala['sala']);
        
            if (salaInfo) {
                let capacidadeNormal = parseInt(salaInfo['Capacidade Normal'], 10);
                return capacidadeNormal >= inscritos_no_turno;
            } else {
                return false;
            }
        });

        if (filteredSalasAvailable.length === 0) {
            alert("Não exite nenhuma sala com capacidade suficiente para as preferências indicadas");
            return;
        }


  // Condição quando o utilizador indica os inputs obrigatórios e o das Salas Inaceitáveis
  } else if(preferenciaSala1Value === "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis") {

      caracteristaDasSalas.forEach(function(item) {
          var condicao = item[salasInaceitaveisValue] === 1;
          if (condicao){
              salasInaceitaveisSelec.push(item['Nome sala']);
          }
      });

      nomesSalas.forEach(room => {
          if(!salasAvailable.some(record => record.sala === room)){
              if(startHour == 8 && endHour == 13){
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '08:00:00',
                      horaFim: '09:30:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '09:30:00',
                      horaFim: '11:00:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '11:00:00',
                      horaFim: '12:30:00'
                  })
              } else if (startHour == 13 && endHour == 18){
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '13:00:00',
                      horaFim: '14:30:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '14:30:00',
                      horaFim: '16:00:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '16:00:00',
                      horaFim: '17:30:00'
                  })
                  
              } else if(startHour == 18 && endHour == 23) {
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '18:00:00',
                      horaFim: '19:30:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '19:30:00',
                      horaFim: '21:00:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '21:00:00',
                      horaFim: '22:30:00'
                  })
              }
              }

      });

      filteredSalasAvailable = salasAvailable.filter(record => !salasInaceitaveisSelec.includes(record.sala));

      if (filteredSalasAvailable.length === 0) {
          alert("Não exite nenhum slot disponível para as preferências indicadas");
          return;
      }

      // Filtrar as salasDisponíveis apenas por aquelas que têm a capacidade necessária para a aula em questão
      filteredSalasAvailable = filteredSalasAvailable.filter(sala => {
        let salaInfo = caracteristaDasSalas.find(item => item['Nome sala'] == sala['sala']);
    
        if (salaInfo) {
            let capacidadeNormal = parseInt(salaInfo['Capacidade Normal'], 10);
            return capacidadeNormal >= inscritos_no_turno;
        } else {
            return false;
        }
    });

    if (filteredSalasAvailable.length === 0) {
        alert("Não exite nenhuma sala com capacidade suficiente para as preferências indicadas");
        return;
    }


  // Condição quando o utilizador indica os inputs obrigatórios, o de salas preferidas e salas inaceitáveis
  } else if (preferenciaSala1Value !== "Escolha uma preferência" && salasInaceitaveisValue !== "Indique as salas inaceitáveis"){

      caracteristaDasSalas.forEach(function(item) {
          var condicao = item[preferenciaSala1Value] === 1 && item['Capacidade Normal'] >= inscritos_no_turno && !(item['Nome sala'] in aggregatedsalasOcupadas);

          if (condicao){
              salasPreferidas.push(item['Nome sala']);
          }

          salasPreferidas.forEach(room => {
              if(!salasAvailable.some(record => record.sala === room)){
                  if(startHour == 8 && endHour == 13){
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '08:00:00',
                          horaFim: '09:30:00'
                      })
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '09:30:00',
                          horaFim: '11:00:00'
                      })
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '11:00:00',
                          horaFim: '12:30:00'
                      })
                  } else if (startHour == 13 && endHour == 18){
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '13:00:00',
                          horaFim: '14:30:00'
                      })
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '14:30:00',
                          horaFim: '16:00:00'
                      })
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '16:00:00',
                          horaFim: '17:30:00'
                      })
                      
                  } else if(startHour == 18 && endHour == 23) {
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '18:00:00',
                          horaFim: '19:30:00'
                      })
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '19:30:00',
                          horaFim: '21:00:00'
                      })
                      salasAvailable.push({
                          sala: room,
                          HoraInicio: '21:00:00',
                          horaFim: '22:30:00'
                      })
                  }
              }

          });

      });


      if(salasAvailable.length !== 0){
          salasAvailable.forEach(sala => {
              sala['caracteristica'] = preferenciaSala1Value;
          });
      }
      

      if(salasAvailable.length === 0 && preferenciaSala2Value !== undefined){
          caracteristaDasSalas.forEach(function(item) {


              var condicao2 = item[preferenciaSala2Value] === 1 && item['Capacidade Normal'] >= inscritos_no_turno && !(item['Nome sala'] in aggregatedsalasOcupadas); 

              if (condicao2){
                  salasPreferidas.push(item['Nome sala']);
              }

              salasPreferidas.forEach(room => {
                  if(!salasAvailable.some(record => record.sala === room)){
                      if(startHour == 8 && endHour == 13){
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '08:00:00',
                              horaFim: '09:30:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '09:30:00',
                              horaFim: '11:00:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '11:00:00',
                              horaFim: '12:30:00'
                          })
                      } else if (startHour == 13 && endHour == 18){
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '13:00:00',
                              horaFim: '14:30:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '14:30:00',
                              horaFim: '16:00:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '16:00:00',
                              horaFim: '17:30:00'
                          })
                          
                      } else if(startHour == 18 && endHour == 23) {
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '18:00:00',
                              horaFim: '19:30:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '19:30:00',
                              horaFim: '21:00:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '21:00:00',
                              horaFim: '22:30:00'
                          })
                      }
                  }
  
              });

          });

          if(salasAvailable.length !== 0){
            salasAvailable.forEach(sala => {
                sala['caracteristica'] = preferenciaSala2Value;
            })
        }

      }

      


      if(salasAvailable.length === 0 && preferenciaSala3Value !== undefined){
          caracteristaDasSalas.forEach(function(item) {

              var condicao3 = item[preferenciaSala3Value] === 1 && item['Capacidade Normal'] >= inscritos_no_turno && !(item['Nome sala'] in aggregatedsalasOcupadas); 

              if (condicao3){
                  salasPreferidas.push(item['Nome sala']);
              }

              salasPreferidas.forEach(room => {
                  if(!salasAvailable.some(record => record.sala === room)){
                      if(startHour == 8 && endHour == 13){
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '08:00:00',
                              horaFim: '09:30:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '09:30:00',
                              horaFim: '11:00:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '11:00:00',
                              horaFim: '12:30:00'
                          })
                      } else if (startHour == 13 && endHour == 18){
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '13:00:00',
                              horaFim: '14:30:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '14:30:00',
                              horaFim: '16:00:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '16:00:00',
                              horaFim: '17:30:00'
                          })
                          
                      } else if(startHour == 18 && endHour == 23) {
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '18:00:00',
                              horaFim: '19:30:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '19:30:00',
                              horaFim: '21:00:00'
                          })
                          salasAvailable.push({
                              sala: room,
                              HoraInicio: '21:00:00',
                              horaFim: '22:30:00'
                          })
                      }
                  }
  
              });
          });

          if(salasAvailable.length !== 0) {
              salasAvailable.forEach(sala => {
                  sala['caracteristica'] = preferenciaSala3Value;
              })
          }

      }


      filteredSalasAvailable = salasAvailable.filter(sala => {
        let salaInfo = caracteristaDasSalas.find(item => item['Nome sala'] == sala['sala']);
    
        if (salaInfo) {
            let capacidadeNormal = parseInt(salaInfo['Capacidade Normal'], 10);
            return capacidadeNormal >= inscritos_no_turno;
        } else {
            return false;
        }
    });

    if (filteredSalasAvailable.length === 0) {
        alert("Não exite nenhuma sala com capacidade suficiente para as preferências indicadas");
        return;
    }


    filteredSalasAvailable = filteredSalasAvailable.filter(record => !salasInaceitaveisSelec.includes(record.sala));

    if (filteredSalasAvailable.length === 0) {
        alert("Não exite nenhum slot disponível para as preferências indicadas");
        return;
    }


  // Condição quando o utilizador apenas indica os inputs obrigatórios
  } else {
  // Obter todas as salas que estão disponíveis (todas menos as ocupadas)
      nomesSalas.forEach(room => {
          if(!salasAvailable.some(record => record.sala === room)){
              if(startHour == 8 && endHour == 13){
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '08:00:00',
                      horaFim: '09:30:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '09:30:00',
                      horaFim: '11:00:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '11:00:00',
                      horaFim: '12:30:00'
                  })
              } else if (startHour == 13 && endHour == 18){
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '13:00:00',
                      horaFim: '14:30:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '14:30:00',
                      horaFim: '16:00:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '16:00:00',
                      horaFim: '17:30:00'
                  })
                  
              } else if(startHour == 18 && endHour == 23) {
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '18:00:00',
                      horaFim: '19:30:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '19:30:00',
                      horaFim: '21:00:00'
                  })
                  salasAvailable.push({
                      sala: room,
                      HoraInicio: '21:00:00',
                      horaFim: '22:30:00'
                  })
              }
              }

      });

      if (salasAvailable.length === 0) {
        alert("Não exite nenhum slot disponível para as preferências indicadas");
        return;
    }

    // Filtrar as salasDisponíveis apenas por aquelas que têm a capacidade necessária para a aula em questão
    filteredSalasAvailable = salasAvailable.filter(sala => {
        let salaInfo = caracteristaDasSalas.find(item => item['Nome sala'] == sala['sala']);
    
        if (salaInfo) {
            let capacidadeNormal = parseInt(salaInfo['Capacidade Normal'], 10);
            return capacidadeNormal >= inscritos_no_turno;
        } else {
            return false;
        }
    });

    if (filteredSalasAvailable.length === 0) {
        alert("Não exite nenhuma sala com capacidade suficiente para as preferências indicadas");
        return;
    }
      
  }

  var slotsProxHTML = generateSlots(arrayParaFunc,filteredSalasAvailable);


  localStorage.setItem('slotsData', JSON.stringify(slotsProxHTML));
  localStorage.setItem('aulaAMudar', JSON.stringify(aulaAMudar));
  localStorage.setItem('cursoData', JSON.stringify(cursoData));
  window.open('./AlteracaoSlots.html', "_blank");
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
  "Hora Inicio da Aula",
  "Hora Fim da Aula",
  "Data da aula",
  "Caracteristicas da sala pedida para a aula",
  "Sala atribuida a aula",
  "Semana do ano",
  "Semana do semestre",
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
  //console.log(aula);
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

/**
* Verifica o comprimento dos elementos filhos dentro de um container identificado pelo seu ID.
* @param {string} containerId - O ID do container.
* @returns {number} O número de elementos filhos dentro do container. Retorna 0 no caso do container não ser encontrado.
*/
function checkContainerLength(containerId) {
const container = document.getElementById(containerId);
if (container) {
  const length = container.children.length;
  return length;
} else {
  return 0; // Retorna 0 para tratar o erro
}
}
