
const form = document.getElementById('userInputForm');
let jsonData;

function adicionarAulas(inputs) {
    let filteredJson;
    numeroAulas = inputs[1];
    for (let i = 0; i < numeroAulas; i++) {
        const novaAula = {
            "UC": inputs[0]
        };
        jsonData.push(novaAula);
    }
}

// Adicionando um ouvinte de evento para o evento de envio do formulário
form.addEventListener('submit', function (event) {
    event.preventDefault();
    alert("O formulário foi enviado com sucesso!"); // Exibe um alerta
    inputs = [];
    inputs.push(document.getElementById('input1').value);
    inputs.push(document.getElementById('input2').value);
    var checkboxes = document.getElementsByName('periodoPossivel');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            inputs.push(checkbox.value);
        }
    });
    var checkboxes = document.getElementsByName('diaDaSemanaPref');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            inputs.push(checkbox.value);
        }
    });
    inputs.push(document.getElementById('preferenciaSala').value);
    inputs.push(document.getElementById('salasInaceitaveis').value);
    inputs.push(document.getElementById('input6').value);
    inputs.push(document.getElementById('input7').value);
    inputs.push(document.getElementById('input8').value);

    adicionarAulas(inputs);
    // Exibindo os valores na janela de alerta (você pode manipulá-los como quiser)
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

        const salas = data;

        // Obter todas as salas
        const nomesSalas = salas.map(room => room['Nome sala']);
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
