const {decimalParaHora, initParametrosSemana, filterCapacidade, parseHour} = require('./functionsToTest');
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
        expect(decimalParaHora(9.6)).toBe(10);
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

