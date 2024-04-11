const {decimalParaHora, initParametrosSemana, filterCapacidade, parseHour, adicionarAulas} = require('./functionsToTest');
const {checkIfEmpty, createJsonEntry} = require('./functionsToTestHorario');

let salas = [
    {
      "Edifício": "Ala Autónoma (ISCTE-IUL)",
      "Nome sala": "Auditório Afonso de Barros",
      "Capacidade Normal": "80",
      "Capacidade Exame": "39",
      "Nº características": "4",
      "Anfiteatro aulas": "",
      "Apoio técnico eventos": "",
      "Arq 1": "",
      "Arq 2": "",
      "Arq 3": "",
      "Arq 4": "",
      "Arq 5": "",
      "Arq 6": "",
      "Arq 9": "",
      "BYOD (Bring Your Own Device)": "",
      "Focus Group": "",
      "Horário sala visível portal público": 1,
      "Laboratório de Arquictetura de Computadores I": "",
      "Laboratório de Arquictetura de Computadores II": "",
      "Laboratório de Base de Engenharia": "",
      "Laboratório de Eletrónica": "",
      "Laboratório de Informática": "",
      "Laboratório de Jornalismo": "",
      "Laboratório de Redes de Computadores I": "",
      "Laboratório de Redes de Computadores II": "",
      "Laboratório de Telecomunicações": "",
      "Sala Aulas Mestrado": 1,
      "Sala Aulas Mestrado Plus": 1,
      "Sala NEE": "",
      "Sala Provas": "",
      "Sala Reunião": "",
      "Sala de Arquitetura": "",
      "Sala de Aulas normal": 1,
      "Videoconferência": "",
      "Átrio": ""
    },
    {
      "Edifício": "Ala Autónoma (ISCTE-IUL)",
      "Nome sala": "Auditório Silva Leal",
      "Capacidade Normal": "54",
      "Capacidade Exame": "27",
      "Nº características": "4",
      "Anfiteatro aulas": "",
      "Apoio técnico eventos": "",
      "Arq 1": "",
      "Arq 2": "",
      "Arq 3": "",
      "Arq 4": "",
      "Arq 5": "",
      "Arq 6": "",
      "Arq 9": "",
      "BYOD (Bring Your Own Device)": "",
      "Focus Group": "",
      "Horário sala visível portal público": 1,
      "Laboratório de Arquictetura de Computadores I": "",
      "Laboratório de Arquictetura de Computadores II": "",
      "Laboratório de Base de Engenharia": "",
      "Laboratório de Eletrónica": "",
      "Laboratório de Informática": "",
      "Laboratório de Jornalismo": "",
      "Laboratório de Redes de Computadores I": "",
      "Laboratório de Redes de Computadores II": "",
      "Laboratório de Telecomunicações": "",
      "Sala Aulas Mestrado": 1,
      "Sala Aulas Mestrado Plus": 1,
      "Sala NEE": "",
      "Sala Provas": "",
      "Sala Reunião": "",
      "Sala de Arquitetura": "",
      "Sala de Aulas normal": 1,
      "Videoconferência": "",
      "Átrio": ""
    },
    {
      "Edifício": "Ala Autónoma (ISCTE-IUL)",
      "Nome sala": "AA2.23",
      "Capacidade Normal": "50",
      "Capacidade Exame": "23",
      "Nº características": "5",
      "Anfiteatro aulas": "",
      "Apoio técnico eventos": "",
      "Arq 1": "",
      "Arq 2": "",
      "Arq 3": "",
      "Arq 4": "",
      "Arq 5": "",
      "Arq 6": "",
      "Arq 9": "",
      "BYOD (Bring Your Own Device)": "",
      "Focus Group": "",
      "Horário sala visível portal público": 1,
      "Laboratório de Arquictetura de Computadores I": "",
      "Laboratório de Arquictetura de Computadores II": "",
      "Laboratório de Base de Engenharia": "",
      "Laboratório de Eletrónica": "",
      "Laboratório de Informática": "",
      "Laboratório de Jornalismo": "",
      "Laboratório de Redes de Computadores I": "",
      "Laboratório de Redes de Computadores II": "",
      "Laboratório de Telecomunicações": "",
      "Sala Aulas Mestrado": 1,
      "Sala Aulas Mestrado Plus": 1,
      "Sala NEE": "",
      "Sala Provas": "",
      "Sala Reunião": "",
      "Sala de Arquitetura": "",
      "Sala de Aulas normal": 1,
      "Videoconferência": "",
      "Átrio": ""
    },]


describe('Testes para a função decimalParaHora', () => {
    test('Teste de hora', () => {
        expect(decimalParaHora(10.60)).toBe(11);
    });
    test('Qualquer outro input', () => {
        expect(decimalParaHora(9.3)).toBe(9.3);
    });
});  

describe('Testes para a função initParametrosSemana', () => {
    test('Teste com input', () => {
        const result = initParametrosSemana(["Ter", "Qua", "Sex"]);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe("Ter");
        expect(result[2]).toBe(3); 
    });
    test('Teste com null', () => {
        const result = initParametrosSemana(null);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe("Seg");
        expect(result[2]).toBe(0);
    });
}); 

describe('Testes para a função filterCapacidade', () => {  
    test('Teste para não devolver nada', () => {
        expect(filterCapacidade(salas, 500)).toEqual([]);
    });
    test('Teste para quando o número de alunos não é dado', () => {
        expect(filterCapacidade(salas, null)).toEqual(salas);
    });
});

describe('Testes para a função parseHour', () => {  
    test('Teste com valor errado', () => {
        expect(parseHour("100")).toEqual("100");
    });
    test('Teste para substituir "." por ":"', () => {
        expect(parseHour("10.3")).toEqual("10:30");
    });
}); 


describe('Testes para a função adicionarAulas', () => {
    test('Teste para número de aulas excedido', () => {
        const inputs = ["UC1", 5, ["8:00-9:30"], ["Seg"], [], [], 30, "NomeCurso", 15];
        expect(() => adicionarAulas(inputs)).toThrow("Não há slots suficientes para as condições pedidas. Tente novamente.");
    });

    test('Teste para não haver slots suficientes', () => {
        const inputs = ["UC1", 5, ["8:00-9:30"], ["Seg"], [], [], 30, "NomeCurso", 14];
        expect(() => adicionarAulas(inputs)).toThrow("Não há slots suficientes para as condições pedidas. Tente novamente.");
    });

    test('Teste para período nulo', () => {
        const inputs = ["UC1", 5, null, ["Seg"], [], [], 30, "NomeCurso", 0];
        // Coloque as expectativas aqui, dependendo do comportamento esperado para esse caso
    });

    test('Teste para dia da semana nulo', () => {
        const inputs = ["UC1", 5, ["8:00-9:30"], null, [], [], 30, "NomeCurso", 0];
        // Coloque as expectativas aqui, dependendo do comportamento esperado para esse caso
    });

    test('Teste para dia da semana vazio', () => {
        const inputs = ["UC1", 5, ["8:00-9:30"], [], [], [], 30, "NomeCurso", 0];
        // Coloque as expectativas aqui, dependendo do comportamento esperado para esse caso
    });
});

describe('Testes para a função checkIfEmpty', () => {  
    test('Teste com valor errado', () => {
        const array1 = [1,2,3];
        expect(checkIfEmpty(array1)).toEqual(false);
    });
    test('Teste com o valor correto', () => {
        const array2 = [];
        expect(checkIfEmpty(array2)).toEqual(true);    
    });
}); 

describe('Testes para a função createJsonEntry', () => {  
    test('Teste com array de inputs', () => {
        const inputArray = [
            "ME",                   
            "Teoria dos Jogos e dos Contratos", 
            "01789TP01",
            "MEA1",
            "30",
            "Sex",
            "13:00:00",
            "14:30:00",
            "2022/12/02",
            "Sala Aulas Mestrado",
            "AA2.25",
            48,
            14
        ];

          jsonArray = {
            "Curso": "ME",
            "UC": "Teoria dos Jogos e dos Contratos",
            "Turno": "01789TP01",
            "Turma": "MEA1",
            "Inscritos no Turno": "30",
            "Dia da Semana": "Sex",
            "Hora Início da Aula": "13:00:00",
            "Hora Fim da Aula": "14:30:00",
            "Data da aula": "2022/12/02",
            "Caracteristicas da sala pedida para a aula": "Sala Aulas Mestrado",
            "Sala atribuida a aula": "AA2.25",
            "Semana do ano": 48,
            "Semana do semestre": 14
        }
        expect(createJsonEntry(inputArray)).toEqual(jsonArray);
    });
}); 
