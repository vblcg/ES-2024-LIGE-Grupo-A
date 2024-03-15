const assert = require('chai').assert;
const { toggleColumn, minMaxFilterFunction } = require('../../main/HTML/horario');


describe('minMaxFilterFunction', function() {
    it('Deve retornar true para um intervalo válido', function() {
        const headerValue = { start: 10, end: 20 };
        assert.isTrue(minMaxFilterFunction(headerValue, 15, {}, {}));
    });

    it('Deve retornar falso para um intervalo inválido', function() {
        const headerValue = { start: 10, end: 20 };
        assert.isFalse(minMaxFilterFunction(headerValue, 5, {}, {})); // Value outside range
        assert.isFalse(minMaxFilterFunction(headerValue, 25, {}, {})); // Value outside range
    });

    it('Deve retornar verdadeiro se os mínimo e o máximo não estiverem especificados', function() {
        const headerValue = { start: '', end: '' };
        assert.isTrue(minMaxFilterFunction(headerValue, 15, {}, {}));
    });

    it('Deve retornar true se o valor da coluna for null ou undefined', function() {
        const headerValue = { start: 10, end: 20 };
        assert.isTrue(minMaxFilterFunction(headerValue, null, {}, {}));
        assert.isTrue(minMaxFilterFunction(headerValue, undefined, {}, {}));
    });
});
