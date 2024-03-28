const form = document.getElementById('userInputForm');
let jsonData;
let jsonSalas;


//TO-DO SEMANAS DO SEMESTRE -> COMEÇO DE MARCAÇÃO FORMULARIO
// LICENCIATURA FORMULARIO
function adicionarAulas(inputs) {
    let slotsDisponiveis = {};
    let filteredJson = jsonData;
    numeroAulas = inputs[1];
    periodos = inputs[2];
    diasSemana = inputs[3];
    salasInaceitaveis = inputs[5];
    numeroAlunos = inputs[6];

    //FILTRO DIA DA SEMANA, SE HOUVER INPUT
    if(diasSemana != null) {
        filteredJson = jsonData.filter(entry => diasSemana.includes(entry['Dia da Semana']));
    }
    //console.log(filteredJson);

   
    //FILTRO CAPACIDADE
    if(numeroAlunos == null) 
        numeroAlunos = 0;
    let salasDisponiveis = jsonSalas.map(room => room['Nome sala']);
    let filteredSalas = [];
    jsonSalas.forEach(entry => {
        if(parseFloat(entry['Capacidade Normal']) >= numeroAlunos && salasDisponiveis.includes(entry['Nome sala']))
            filteredSalas.push((entry['Nome sala']));
    });

    //FILTRO SALAS INACEITAVEIS
    salasDisponiveis = filteredSalas;
    salasDisponiveis = salasDisponiveis.filter(entry => !salasInaceitaveis.includes(entry));

    semanaSemestre = 1;
    for(let semana = 0; semana < numeroAulas; semana++) {
        //fazer else
        if(periodos ==null) {
            exist = false;
            min = 8.0;
            max = 9.30;
            count = 0;
            //VER SE HA ALGUMA DAS SALAS PREFERIDAS AQUI
            while(!exist) {
                min += (1.3 * count);
                max += (1.3 * count);
                //FILTRO POR SEMANA -> ATENÇÃO, DEVE FILTRAR UM DIA DE CADA VEZ, COMEÇAR NA SEGUNDA (IF QUE VERIFICA SE DEPOIS DOS FILTROS HA RESULTADOS)
                filteredJson = filteredJson.filter(entry => entry['Semana do semestre'] == semanaSemestre);
                //console.log(filteredJson);
                //FILTRO POR HORÁRIO
                filteredJson = filteredJson.filter(entry => min <= parseFloat(entry["Hora Inicio da Aula"].split(':')[0] + '.' + entry["Hora Inicio da Aula"].split(':')[1]));
                filteredJson = filteredJson.filter(entry =>  parseFloat(entry["Hora Fim da Aula"].split(':')[0] + '.' + entry["Hora Fim da Aula"].split(':')[1]) <= max);            
                salasOcupadas = filteredJson.map(room => room['Sala atribuida a aula']);
                salasDisponiveisFinal = salasDisponiveis.filter(entry => !salasOcupadas.includes(entry));
                console.log(filteredJson);
                //console.log(salasOcupadas);
                console.log(salasDisponiveisFinal);
                //FAZER VERIFICACAO NAS SALAS DISPONIVEIS SE HA ALGUMA QUE CORRESPONDE A PREFERENCIA
                console.log("SALA ATRIBUIDA: " + salasDisponiveisFinal[0]);
                if(salasDisponiveisFinal.length > 0)
                    exist = true;
                count++;
                semanaSemestre++;
            }     
        }
        const novaAula = {
            "UC" : inputs[0] 
        };
        //slotsDisponiveis.push(novaAula);
    }
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
