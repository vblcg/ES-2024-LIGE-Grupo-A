const test = require('ava');
const { minMaxFilterFunction } = require('../../main/HTML/horario');

test('minMaxFilterFunction deve retornar verdadeiro para um intervalo válido', t => {
    const headerValue = { start: 10, end: 20 };
    t.true(minMaxFilterFunction(headerValue, 15, {}, {}));
});

test('minMaxFilterFunction deve retornar falso para um intervalo inválido', t => {
    const headerValue = { start: 10, end: 20 };
    t.false(minMaxFilterFunction(headerValue, 5, {}, {})); // Valor fora do intervalo
    t.false(minMaxFilterFunction(headerValue, 25, {}, {})); // Valor fora do intervalo
});

test('minMaxFilterFunction deve retornar verdadeiro se o mínimo e o máximo não estiverem especificados', t => {
    const headerValue = { start: '', end: '' };
    t.true(minMaxFilterFunction(headerValue, 15, {}, {}));
});

test('minMaxFilterFunction deve retornar verdadeiro se o valor da coluna for nulo ou indefinido', t => {
    const headerValue = { start: 10, end: 20 };
    t.true(minMaxFilterFunction(headerValue, null, {}, {}));
    t.true(minMaxFilterFunction(headerValue, undefined, {}, {}));
});