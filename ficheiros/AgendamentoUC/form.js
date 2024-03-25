const fs = require('fs');

const form = document.getElementById('userInputForm');
let jsonData;

function adicionarAulas(inputs) {
    numeroAulas = inputs[1];
    for(let i = 0; i < numeroAulas; i++) {
        const novaAula = {
            "UC" : inputs[0] 
        };
        jsonData.push(novaAula);
    }
    writeFile(jsonData, '../Horário.json');
}

// Adicionando um ouvinte de evento para o evento de envio do formulário
form.addEventListener('submit', function(event) {
    event.preventDefault();
    alert("O formulário foi enviado com sucesso!"); // Exibe um alerta
    inputs = [];

    inputs.push(document.getElementById('input1').value);
    inputs.push(document.getElementById('input2').value);
    inputs.push(document.getElementById('input3').value);
    inputs.push(document.getElementById('input4').value);
    inputs.push(document.getElementById('input5').value);
    inputs.push(document.getElementById('input6').value);
    inputs.push(document.getElementById('input7').value);
    inputs.push(document.getElementById('input8').value);
    inputs.push(document.getElementById('input9').value);

    adicionarAulas(inputs);
    console.log(jsonData);
    // Exibindo os valores na janela de alerta (você pode manipulá-los como quiser)
});

_writeFile("../Horário.json", data, (error) => {
    // throwing the error
    // in case of a writing problem
    if (error) {
      // logging the error
      console.error(error);
  
      throw error;
    }
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
