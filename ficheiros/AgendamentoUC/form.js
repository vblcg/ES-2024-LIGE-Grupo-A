document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addPreferenceBtn');
    const addButtonSalasIn =  document.getElementById('addSalaInaceitavel');
    const preferencesContainer = document.getElementById('preferencias-container');
    const inaceitavelCointainer = document.getElementById('salasInaceitaveis-container');
    const pathJsonSalas = 'CaracterizacaoDasSalas.json';  
    let preferenceCount = 1;
    let inaceitavelCount = 1;
    let jsonData;
    let salas;
    let tiposDeSala;

    addButton.addEventListener('click', function () {
        preferenceCount++;
        const preferenceDiv = document.createElement('div');
        preferenceDiv.classList.add('form-group');
        preferenceDiv.innerHTML = `<div class="form-group">
            <p>Preferência nº${preferenceCount}:</p>
            <select class="form-select" id="preferenciaSala${preferenceCount}" aria-label="Default select example">
                <option selected>Escolha uma Preferência</option>
            </select>
            </div>`;

        preferencesContainer.appendChild(preferenceDiv);
        const novaPref = document.getElementById(`preferenciaSala${preferenceCount}`);
        tiposDeSala.forEach(tipoDeSala => {
            const optionTipoSala = document.createElement('option');
            optionTipoSala.textContent = tipoDeSala;
            novaPref.appendChild(optionTipoSala);
        })

    });

    addButtonSalasIn.addEventListener('click', function () {
        inaceitavelCount++;
        // Adiciona um novo input para as salas inaceitáveis
        const inaceitavelDiv = document.createElement('div');
        inaceitavelDiv.classList.add('form-group');
        inaceitavelDiv.innerHTML = `<div class="form-group">
            <p>Sala inaceitável nº${inaceitavelCount}:</p>
            <select class="form-select" id="salaInaceitavel${inaceitavelCount}" aria-label="Default select example">
                <option selected>Escolha uma sala inaceitável</option>
            </select>
            </div>`;

        inaceitavelCointainer.appendChild(inaceitavelDiv);
        const novaInaceitavel = document.getElementById(`salaInaceitavel${inaceitavelCount}`);

        tiposDeSala.forEach(tipoDeSala => {
            const optionTipoSala = document.createElement('option');
            optionTipoSala.textContent = tipoDeSala;
            novaInaceitavel.appendChild(optionTipoSala);
        })
    });

    function initializeSelectOptionsSalas() {
        tiposDeSala = ['Anfiteatro', 'Arquitetura', 'BYOD (Bring Your Own Device)', 'Focus Group', 'Laboratório de Arquitetura de Computadores', 'Laboratório de Bases de Engenharia', 'Laboratório de Electrónica', 'Laboratório de Informática', 'Laboratório de Jornalismo', 'Laboratório de Redes de Computadores', 'Laboratório de Telecomunicações', 'Sala Aulas Mestrado', 'Sala Aulas Mestrado Plus', 'Sala NEE', 'Sala Provas', 'Sala Reunião', 'Sala de Arquitectura', 'Sala de Aulas normal', 'videoconferência', 'Átrio'];
        let nomesSalas = salas.map(room => room['Nome sala']);
    
        const preferenciaSala1 = document.getElementById('preferenciaSala1');
        const salasInaceitaveis = document.getElementById('salasInaceitaveis');
    
        // Adicionar cada tipo de sala existente aos respetivos inputs
        tiposDeSala.forEach(tipoDeSala => {
            const optionTipoSala = document.createElement('option');
            optionTipoSala.textContent = tipoDeSala;
            preferenciaSala1.appendChild(optionTipoSala);
    
            const OptionTipoSalaInaceitavel = document.createElement('option');
            OptionTipoSalaInaceitavel.textContent = tipoDeSala;
            salasInaceitaveis.appendChild(OptionTipoSalaInaceitavel);
        });
    }
     
    fetch(pathJsonSalas)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${pathJsonSalas}: ${response.statusText}`);
            }
            return response.json();
        })
    
        .then(data => {
    
            salas = data;
    
            initializeSelectOptionsSalas();
    })
    .catch(error => {
    console.error(`Error loading ${pathJsonSalas}:`, error);
    });

    
    function decimalParaHora(decimal) {
        let horaInteira = Math.floor(decimal);
        let minutos = Math.round((decimal - horaInteira)*100)/100;
        if(minutos == 0.6) return Math.round(decimal);
        else if(minutos == 0.9) return (Math.round(decimal) + 0.3);
        else return decimal;
    }
    

    //testado
    function initParametrosSemana(diasSemanaInput) {
        const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
        var diaSemanaNumero = 0;
        if (diasSemanaInput != null) {
            var diaSemanaString = diasSemanaInput[0];
            var inputsDias = diasSemanaInput.length;
        } else {
            var diaSemanaString = diasDaSemana[0];
            var inputsDias = 0;
        }
        return [diaSemanaNumero, diaSemanaString, inputsDias];
    }

    //testado
    function filterCapacidade(salas, numeroAlunos) {
        if(numeroAlunos != null) {
            return salas.filter(entry => parseFloat(entry['Capacidade Normal']) >= numeroAlunos);
        } else {
            return salas;
        }
    }

    function parseHour(hour) {
        if(hour.toString().includes("."))
            return hour.toString().replace(".", ":") + "0:00";
        else if(hour.toString().includes(":"))
            return hour.toString() + "0:00";
        else 
            return hour.toString() + ":00:00";
    }

    function parseDay(dia) {
        if(dia == "Seg")
            return 1;
        else if(dia == "Ter")
            return 2;
        else if(dia == "Qua")
            return 3;
        else if(dia == "Qui")
            return 4;
        else if(dia == "Sex")
            return 5;
        else if(dia == "Sab")
            return 6;
        return null;
    }

    function calcularDiaDoAno(ano, semana, diaDaSemana) {
        diaDaSemana = parseDay(diaDaSemana);
        var primeiraDataDoAno = new Date(ano, 0, 1);
        var primeiroDiaDaSemana = primeiraDataDoAno.getDay();        
        var deslocamento = diaDaSemana - primeiroDiaDaSemana;
        
        if (deslocamento < 0) {
            deslocamento += 7;
        }
        
        var diasDesdePrimeiroDia = (semana - 1) * 7 + deslocamento;
        var dataFinal = new Date(ano, 0, 1);
        dataFinal.setDate(dataFinal.getDate() + diasDesdePrimeiroDia);
        
        var dia = dataFinal.getDate();
        var mes = dataFinal.getMonth() + 1; // Adicionando 1 porque os meses em JavaScript são indexados a partir de zero
        var anoString = dataFinal.getFullYear();
        
        if (dia < 10) {
            dia = '0' + dia;
        }
        if (mes < 10) {
            mes = '0' + mes;
        }
        var dataFormatada = anoString + '/' + mes + '/' + dia;
        return dataFormatada;
    }
    

    function criarDocumentoSlot(nomeCurso, UC, numeroAlunos, diaSemanaString, min, max, diaSemana, semanaAno, semanaSemestre, preferencia, salaAlocada) {
        const novaAula = {
            "Curso": nomeCurso,
            "UC": UC,
            "Turno": 1,
            "Turma": 1,
            "Inscritos no Turno": parseInt(numeroAlunos),
            "Dia da Semana": diaSemanaString,
            "Hora Inicio da Aula": parseHour(min),
            "Hora Fim da Aula": max,
            "Data da aula": diaSemana,
            "Semana do ano": semanaAno,
            "Semana do semestre": semanaSemestre,
            "Caracteristicas da sala pedida para a aula": preferencia,
            "Sala atribuida a aula": salaAlocada['Nome sala'],
        };
        return novaAula;
    }

    function adicionarAulas(inputs) {
        let UC = inputs[0];
        let numeroAulas = inputs[1];
        let periodos = inputs[2];
        let diasSemanaInput = inputs[3];
        let preferencias = inputs[4];
        let salasInaceitaveis = inputs[5];
        var numeroAlunos = inputs[6];
        let nomeCurso = inputs[7];
        let aulasSemana = inputs[9];
        var preferencia = null;
        const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
        var slots = [];

        console.log(salasInaceitaveis);

        //INICIALIZAÇÃO PARAMETROS SEMANA -> diaSemanaString ex: "Seg", diaSemanaNumero -> para aceder aos arrays, inputsDias -> para verificar se já se viram todos os dias de input
        let results = initParametrosSemana(diasSemanaInput); //Testado
        var diaSemanaNumero = results[0];
        var diaSemanaString = results[1];
        var inputsDias = results[2];

        for(let aulas = 0; aulas < aulasSemana; aulas++) {
            var semanaSemestre = parseInt(inputs[8]); 
            var filteredJson = jsonData;
            for(let semana = 0; semana < numeroAulas; semana++) {
                var exist = false;
                var horaCount = 1;
                if(periodos == null) {
                    var min = decimalParaHora(8.0 + (aulas*1.3));
                    var max = decimalParaHora(9.30 + (aulas*1.3));
                } else {
                    var min = parseFloat(periodos[0].split("-")[0]);
                    min = decimalParaHora(min + (aulas*1.3));
                    console.log(min);
                    //var max = parseFloat(decimalParaHora(periodos[0].split("-")[1]));
                   // console.log(min);
                    var countPeriodosInput = 1;
                }
                while(!exist) {
                    if (semanaSemestre >= parseInt(inputs[8]) + 15) {
                        alert("Não é possível marcar o número de aulas pedido. Tente novamente.");
                        return;
                    }
                    //LÓGICA SLOTS
                    if(periodos == null) {
                        if(decimalParaHora(max + (1.67 * horaCount)) >= 23.00) {
                            min = 8.0;
                            max = 9.30;
                            horaCount = 0; 
                            diaSemanaNumero += 1; //AVANÇA UM DIA NA SEMANA
                            if(diasSemanaInput != null && diaSemanaNumero < inputsDias) {
                                diaSemanaString = diasSemanaInput[diaSemanaNumero]; //SE AINDA HOUVER MAIS DIAS SELECIONADOS PARA VERIFICAR
                            } else if(diasSemanaInput == null) {
                                diaSemanaString = diasDaSemana[diaSemanaNumero]; //SE NÃO SE TIVEREM SELECIONADO DIAS
                            } else if(semanaSemestre >= 15) { 
                                alert("Não há slots suficientes para as condições pedidas. Tente novamente.");
                                return;
                            } else {
                                semanaSemestre += 1;
                                diaSemanaNumero = 0;
                            }
                        } else {
                            min = decimalParaHora((1.3 * horaCount)+min);
                            max = decimalParaHora((1.3 * horaCount)+max);
                            horaCount ++;
                        }
                    } else { 
                        if(decimalParaHora(min + 1.3) >= max && countPeriodosInput < periodos.length) {
                            min = parseFloat(periodos[countPeriodosInput].split("-")[0]);
                            max = parseFloat(periodos[countPeriodosInput].split("-")[1]);
                            countPeriodosInput ++;
                            diaSemanaNumero ++;
                        } else if(countPeriodosInput > periodos.length){
                            min = parseFloat(periodos[0].split("-")[0]);
                            max = parseFloat(periodos[0].split("-")[1]);
                            if(diasSemanaInput != null && diaSemanaNumero < inputsDias) {
                                diaSemanaString = diasSemanaInput[diaSemanaNumero]; //SE AINDA HOUVER MAIS DIAS SELECIONADOS PARA VERIFICAR
                            } else if(diasSemanaInput == null) {
                                diaSemanaString = diasDaSemana[diaSemanaNumero]; //SE NÃO SE TIVEREM SELECIONADO DIAS
                            } else if(semanaSemestre >= 15) { 
                                alert("Não há slots suficientes para as condições pedidas. Tente novamente.");
                                return;
                            } else {
                                semanaSemestre += 1;
                                diaSemanaNumero = 0;
                            }
                        } else {
                            min = decimalParaHora(min + 1.3);
                        }  
                    } 

                    
                    //FILTRO CAPACIDADE -> Testado
                    var filteredSalas = filterCapacidade(salas, numeroAlunos);
    
                    //FILTRO SALAS INACEITAVEIS
                    for(let pref = 0; pref < salasInaceitaveis.length; pref ++) {
                        if(preferencias[pref] != null && filteredSalas.filter(entry => entry[salasInaceitaveis[pref]] == 1).length > 0) {
                            filteredSalas = filteredSalas.filter(entry => !entry[salasInaceitaveis[pref]] == 1);
                        }
                    }                    
                    console.log(filteredSalas);
                    //FILTRO DIA DA SEMANA
                    filteredJson = jsonData.filter(entry => diaSemanaString == entry['Dia da Semana']);
                    
                    //FILTRO SEMANA DO SEMESTRE 
                    filteredJson = filteredJson.filter(entry => entry['Semana do semestre'] == semanaSemestre);
    
                    //FILTRO POR SLOT
                    filteredJson = filteredJson.filter(entry => min <= parseFloat(entry["Hora Inicio da Aula"].split(':')[0] + '.' + entry["Hora Inicio da Aula"].split(':')[1]));
                    filteredJson = filteredJson.filter(entry =>  parseFloat(entry["Hora Fim da Aula"].split(':')[0] + '.' + entry["Hora Fim da Aula"].split(':')[1]) <= max);            
                    var salasOcupadas = filteredJson.map(room => room['Sala atribuida a aula']);
                    filteredSalas = filteredSalas.filter(entry => !salasOcupadas.includes(entry['Nome sala']));
    
                    if(filteredSalas.length > 0) {
                        console.log(filteredSalas)
                        //PREFERÊNCIA SALAS
                        if(preferencias[0] != "Escolha uma Preferência") {
                            for(let pref = 0; pref < preferencias.length; pref ++) {
                                var alocada = false;
                                if(preferencias[pref] != null && filteredSalas.filter(entry => entry[preferencias[pref]] == 1).length > 0) {
                                    salaAlocada = filteredSalas.filter(entry => entry[preferencias[pref]] == 1)[0];
                                    preferencia = preferencias[pref];
                                    alocada = true;
                                }
                            }
                            if(!alocada) {
                                alert("Não há salas disponíveis para as preferências dadas.")
                                return;
                            }
                        } else {
                            preferencia = "Sem preferências";
                            var salaAlocada = filteredSalas[0];
                        }
                        let semanaAno = jsonData.filter(entry => entry['Semana do semestre'] == semanaSemestre)[0];
                        const novaAula = criarDocumentoSlot(nomeCurso, UC, numeroAlunos, diaSemanaString, min, parseHour(decimalParaHora(min+1.3)), calcularDiaDoAno(2022, semanaAno['Semana do ano'], diaSemanaString), semanaAno['Semana do ano'], semanaSemestre, preferencia, salaAlocada);
                        slots.push(novaAula);
                        jsonData.push(novaAula);
                        exist = true;
                    }else{
                        alert("Não há salas disponíveis. Tente de novo com outros parâmetros.");
                        return;
                    }
                    horaCount++;
                    semanaSemestre++;
                }     
            }
        }
        return slots;
    }

    document.getElementById('userInputForm').addEventListener('submit', function(event) {
        event.preventDefault();
            //alert("O formulário foi enviado com sucesso!"); // Exibe um alerta
            let inputs = [];
        
            //nome uc 0
            inputs.push(document.getElementById('UC').value);
            //numero aulas 1
            inputs.push(document.getElementById('nmrAulas').value);
        
            //periodos possiveis 2
            const checkboxes1 = document.querySelectorAll('input[name="periodoPossivel"]');
            const selectedValues1 = [];
            let selectedAny = false;
            checkboxes1.forEach(function(checkbox) {
                if (checkbox.checked) {
                    selectedValues1.push(checkbox.value);
                    selectedAny = true;
                }
            });    
            if(selectedAny) 
                inputs.push(selectedValues1);
            else
                inputs.push(null);
        
            //dias da semana possiveis 3
            const checkboxes2 = document.querySelectorAll('input[name="diaDaSemanaPref"]');
            const selectedValues2 = [];
            let selectedAnyDay = false;
            checkboxes2.forEach(function(checkbox) {
                if (checkbox.checked) {
                    selectedValues2.push(checkbox.value);
                    selectedAnyDay = true;
                }
            });        
            if(selectedAnyDay) 
                inputs.push(selectedValues2);
            else
                inputs.push(null);
        
            //preferencia sala 4
            const preferenciaSalaSelect = document.getElementById("preferenciaSala1");
            const selectedOptions = preferenciaSalaSelect.selectedOptions;
            inputs.push(Array.from(selectedOptions).map(option => option.value));
        
            //salas inaceitaveis 5
            const salasInaceitaveis = document.getElementById('salasInaceitaveis');
            const selectedOptionsInaceitaveis = salasInaceitaveis.selectedOptions;
            inputs.push(Array.from(selectedOptionsInaceitaveis).map(option => option.value));
            console.log(selectedOptionsInaceitaveis);
        
            //numero alunos 6
            inputs.push(document.getElementById('nmrAlunos').value);
        
            //nome curso 7
            inputs.push(document.getElementById('Licenciatura').value)

            //semana semestre começo 8
            inputs.push(document.getElementById('semanaSemestre').value);

            //número de aulas por semana 9
            inputs.push(document.getElementById('nmrAulasSemana').value);
        
            let slots = adicionarAulas(inputs);
            if(slots != null) {
                localStorage.setItem('slotsData', JSON.stringify(slots));
                window.open('SlotsDisponiveis.html', "_blank");
            }
  

    });

    fetch('Horário.json')
        .then(response => response.json()) // Convertendo a resposta para JSON
        .then(data => {
            // Armazenando os dados do JSON em uma variável
            jsonData = data;

        })
        .catch(error => {
            console.error('Ocorreu um erro ao carregar o arquivo JSON:', error);
        });
});
