const decimalParaHora = require('./functionsToTest');
describe('Testes para a função decimalParaHora', () => {
    test('Teste de hora', () => {
        const resultado = decimalParaHora(9.6);
        console.log('Resultado:', resultado); 
        expect(resultado).toBe(10);
    });
    test('Qualquer outro input', () => {
        expect(decimalParaHora(9.3)).toBe(9.3);
    });
});  
