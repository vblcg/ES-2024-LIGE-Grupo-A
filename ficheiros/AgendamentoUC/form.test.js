const decimalParaHora = require('./functionsToTest');
describe('Testes para a função decimalParaHora', () => {
    test('', () => {
        const resultado = decimalParaHora(9.6);
        console.log('Resultado:', resultado); // Adicione esta linha para imprimir o resultado
        expect(resultado).toBe(10);
    });
});  
