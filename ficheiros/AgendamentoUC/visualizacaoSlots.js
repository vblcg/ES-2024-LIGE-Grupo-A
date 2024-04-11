// Recupera os dados de localStorage
var cursoData = JSON.parse(localStorage.getItem('slotsData'));

// Configurações da tabela
var table = new Tabulator("#tabela-dados", {
    data: cursoData,
    layout: "fitDataStretch",
    columns: [
        { title: "Curso", field: "Curso" },
        { title: "UC", field: "UC" },
        { title: "Turno", field: "Turno" },
        { title: "Turma", field: "Turma" },
        { title: "Inscritos no Turno", field: "Inscritos no Turno" },
        { title: "Dia da Semana", field: "Dia da Semana" },
        { title: "Hora Inicio da Aula", field: "Hora Inicio da Aula" },
        { title: "Hora Fim da Aula", field: "Hora Fim da Aula" },
        { title: "Data da Aula", field: "Data da Aula" },
        { title: "Semana do Ano", field: "Semana do Ano" },
        { title: "Semana do semestre", field: "Semana do semestre" },
        { title: "Caracteristicas da sala pedida para a aula", field: "Caracteristicas da sala pedida para a aula" },
        { title: "Sala atribuida a aula", field: "Sala atribuida a aula" }
    ]
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('gravar').addEventListener('click', function() {
        var data = JSON.stringify(cursoData);
        var blob = new Blob([data], { type: 'application/json' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "SlotsAtribuidos.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); 
    });
});