const form = document.getElementById('userInputForm');
let jsonData;
let jsonSalas;


function decimalParaHora(decimal) {
    let horaInteira = Math.floor(decimal);
    let minutos = Math.round((decimal - horaInteira) * 60);
    return hora + minutos;
}
//TO-DO SEMANAS DO SEMESTRE -> COMEÇO DE MARCAÇÃO FORMULARIO
// LICENCIATURA FORMULARIO
function adicionarAulas(inputs) {
    let slotsDisponiveis = [];
    let filteredJson = jsonData;
    numeroAulas = inputs[1];
    periodos = inputs[2];
    diasSemanaInput = inputs[3];
    salasInaceitaveis = inputs[5];
    numeroAlunos = inputs[6];
    nomeCurso = inputs[7];

    const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    //INICIALIZAÇÃO PARAMETROS SEMANA -> diaSemanaString ex: "Seg", diaSemanaNumero -> para aceder aos arrays, inputsDias -> para verificar se já se viram todos os dias de input
    if(diasSemanaInput != null) {
        diaSemanaString = diasSemanaInput[0];
        diaSemanaNumero = 0;
        inputsDias = diasSemanaInput.length;
    } else {
        diaSemana = diasDaSemana[0];
        diaSemanaNumero = 0;
        inputsDias = 0;
    }

    //FILTRO CAPACIDADE
    if(numeroAlunos == null) 
        numeroAlunos = 0;
    let salasDisponiveis = jsonSalas.map(room => room['Nome sala']);

    semanaSemestre = 1; //ATENÇÃO VAI PASSAR A SER INPUT 
    for(let semana = 0; semana < numeroAulas; semana++) {
        //fazer else
        if(periodos == null) {
            exist = false;
            min = 8.0;
            max = 9.30;
            horaCount = 0;
            //VER SE HA ALGUMA DAS SALAS PREFERIDAS AQUI
            while(!exist) {
                //QUANDO SE VIU TODOS OS SLOTS DO DIA
                if(max += (1.3 * horaCount) >= 23.00) {
                    min = 8.0;
                    max = 9.30;
                    horaCount = 0; 
                    diaSemanaNumero += 1; //AVANÇA UM DIA NA SEMANA
                    if(diasSemanaInput != null && diaSemanaNumero < inputsDias) {
                        diaSemanaString = diasSemana[diaSemanaNumero]; //SE AINDA HOUVER MAIS DIAS SELECIONADOS PARA VERIFICAR
                    } else if(diasSemanaInput == null) {
                        diaSemanaString = diasDaSemana[diaSemanaNumero]; //SE NÃO SE TIVEREM SELECIONADO DIAS
                    } else if(semanaSemestre >= 15) { 
                        console.log("NÃO HÁ SLOTS DISPONÍVEIS DE ACORDO COM AS PREFERÊNCIAS INDICADAS");
                    } else {
                        semanaSemestre += 1;
                        diaSemanaNumero = 0;
                    }
                } else {
                    min += decimalParaHora((1.3 * horaCount));
                    max += decimalParaHora((1.3 * horaCount));
                }

                let filteredSalas = [];
                jsonSalas.forEach(entry => {
                    if(parseFloat(entry['Capacidade Normal']) >= numeroAlunos && salasDisponiveis.includes(entry['Nome sala']))
                        filteredSalas.push((entry['Nome sala']));
                });

                //FILTRO SALAS INACEITAVEIS
                filteredSalas = filteredSalas.filter(entry => !salasInaceitaveis.includes(entry));
                
                //FILTRO DIA DA SEMANA
                filteredJson = jsonData.filter(entry => diaSemanaString == entry['Dia da Semana']);
                
                //FILTRO SEMANA DO SEMESTRE 
                filteredJson = filteredJson.filter(entry => entry['Semana do semestre'] == semanaSemestre);

                //FILTRO POR SLOT
                filteredJson = filteredJson.filter(entry => min <= parseFloat(entry["Hora Inicio da Aula"].split(':')[0] + '.' + entry["Hora Inicio da Aula"].split(':')[1]));
                filteredJson = filteredJson.filter(entry =>  parseFloat(entry["Hora Fim da Aula"].split(':')[0] + '.' + entry["Hora Fim da Aula"].split(':')[1]) <= max);            
                salasOcupadas = filteredJson.map(room => room['Sala atribuida a aula']);
                filteredSalas = filteredSalas.filter(entry => !salasOcupadas.includes(entry));

                console.log(filteredJson);
                //console.log(salasOcupadas);
                console.log(filteredSalas);
                //FAZER VERIFICACAO NAS SALAS DISPONIVEIS SE HA ALGUMA QUE CORRESPONDE A PREFERENCIA
                console.log("SALA ATRIBUIDA: " + filteredSalas[0]);
                //NAO ESTA COMPLETO ATENÇÃO
                if(filteredSalas.length > 0) {
                    const novaAula = {
                        "Curso": nomeCurso,
                        "UC": inputs[0],
                        "Turno": "1",
                        "Turma": "",
                        "Inscritos no Turno": numeroAlunos,
                        "Dia da Semana": diaSemanaString,
                        "Hora Inicio da Aula": min,
                        "Hora Fim da Aula": max,
                        "Data da aula": "",
                        "Semana do ano": "",
                        "Semana do semestre": semanaSemestre,
                        "Caracteristicas da sala pedida para a aula": "",
                        "Sala atribuida a aula": filteredSalas[0]
                      };
                      slotsDisponiveis.push(novaAula);
                      exist = true;
                }
                horaCount++;
                semanaSemestre++;
            }     
        }
    }
    console.log(slotsDisponiveis);
}


// Adicionando um ouvinte de evento para o evento de envio do formulário
form.addEventListener('submit', function(event) {
    event.preventDefault();
    alert("O formulário foi enviado com sucesso!"); // Exibe um alerta
    inputs = [];

    //nome uc 0
    inputs.push(document.getElementById('input1').value);
    //numero aulas 1
    inputs.push(document.getElementById('input2').value);
   
    //periodos possiveis 2
    const checkboxes1 = document.querySelectorAll('input[name="periodoPossivel"]');
    const selectedValues1 = [];
    let selectedAny = false;
    checkboxes1.forEach(function(checkbox) {
        if (checkbox.checked) {
            selectedValues1.push(checkbox.value);
        }
    });    
    if(selectedAny) 
        inputs.push(selectedValues1);
    else
        inputs.push(null);

    //dias da semana possiveis 3
    const checkboxes2 = document.querySelectorAll('input[name="diaDaSemanaPref"]');
    const selectedValues2 = [];
    let selectedAnyDay = false;
    checkboxes2.forEach(function(checkbox) {
        if (checkbox.checked) {
            selectedValues2.push(checkbox.value);
            selectedAnyDay = true;
        }
    });        
    if(selectedAnyDay) 
        inputs.push(selectedValues2);
    else
        inputs.push(null);


    //preferencia sala 4
    const preferenciaSalaSelect = document.getElementById("preferenciaSala");
    const selectedOptions = preferenciaSalaSelect.selectedOptions;
    inputs.push(Array.from(selectedOptions).map(option => option.value));

    //salas inaceitaveis 5
    const salasInaceitaveis = document.getElementById('salasInaceitaveis');
    const selectedOptionsInaceitaveis = salasInaceitaveis.selectedOptions;
    inputs.push(Array.from(selectedOptionsInaceitaveis).map(option => option.value));

    //numero alunos 6
    inputs.push(document.getElementById('input8').value);

    //nome curso 7
    inputs.push(document.getElementById('Licenciatura').value)

    adicionarAulas(inputs);
});


// Fazendo uma solicitação HTTP para carregar o arquivo JSON
fetch('../Horário.json')
    .then(response => response.json()) // Convertendo a resposta para JSON
    .then(data => {
        // Armazenando os dados do JSON em uma variável
        jsonData = data;

    })
    .catch(error => {
        console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
    });

fetch('../CaracterizacaoDasSalas.json')
    .then(response => {
        // Verificar se o request foi bem sucedido
        if (!response.ok) {
            throw new Error(`Failed to fetch ${pathJsonSalas}: ${response.statusText}`);
        }

        // Parse the JSON data
        return response.json();
    })

    .then(data => {

        jsonSalas = data;

        // Obter todas as salas
        const nomesSalas = jsonSalas.map(room => room['Nome sala']);
        const preferenciaSala = document.getElementById('preferenciaSala');
        const salasInaceitaveis = document.getElementById('salasInaceitaveis');

        nomesSalas.forEach(nomeSala => {
            const optionPreferencia1 = document.createElement('option')
            optionPreferencia1.type = 'checkbox';
            optionPreferencia1.textContent = nomeSala;
            preferenciaSala.appendChild(optionPreferencia1);

            const optionSalasInaceitaveis = document.createElement('option');
            optionSalasInaceitaveis.type = 'checkbox';
            optionSalasInaceitaveis.textContent = nomeSala;
            salasInaceitaveis.appendChild(optionSalasInaceitaveis);
        });    


    })
    .catch(error => {
        console.error(`Error loading ${pathJsonSalas}:`, error);
    });
