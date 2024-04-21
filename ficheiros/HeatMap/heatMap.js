let horario;
fetch('Horário.json')
.then(response => response.json())
.then(data => {
    horario = data;

    const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const slots = ["08:00:00", "09:30:00","11:00:00","14:30:00","16:00:00","18:00:00","19:30:00", "21:00:00"]
    const min = 0;
    const max = 900;
    const colorScale = d3.scaleLinear().domain([min, max]).range(['#0000ff', '#ff0000']);
    const heatmap = d3.select("#heatmap");
    
    diasDaSemana.forEach(dia => {
        const row = heatmap.append("div").attr("class", "heatmap-row");
        slots.forEach(slot => {
            salasOcupadas = [];
            const valor = horario.filter(item => item["Dia da Semana"] === dia && item["Hora Inicio da Aula"] === slot);
            valor.forEach(sala => {
                if(!salasOcupadas.includes(sala["Sala atribuida a aula"]))
                    salasOcupadas.push(sala["Sala atribuida a aula"]);
            });
            const cor = valor.length != null ? colorScale(valor.length) : "#0000ff"; 
            row.append("div")
                .attr("class", "heatmap-cell")
                .style("background-color", cor)
                .text(`${dia} - ${slot}\n Salas Ocupadas:${salasOcupadas.length}`);
        })  
    });
})
.catch(error => {
    console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
});