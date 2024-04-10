package iscte;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class Extract {
    private File[] inputFile;
    private File outputJsonFile;

    public Extract(File[] inputFile) {
        this.inputFile = inputFile;
        this.outputJsonFile = new File("Aulas.json"); // Define o arquivo de saída como "Aulas.json"
    }

    public File getOutputJsonFile() {
        return outputJsonFile;
    }

    public void readCsvUsingBufferReader() {
        String line;
        String[] colunas = { "Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana",
                "Hora Inicio da Aula", "Hora Fim da Aula", "Data da aula",
                "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula" };

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new FileInputStream(inputFile[0]), StandardCharsets.UTF_8));
                FileWriter writer = new FileWriter(outputJsonFile)) {

            writer.write("[\n");

            line = reader.readLine(); // Lê a primeira linha (cabeçalho) do arquivo CSV
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (!isFirstLine) {
                    writer.write(",\n"); // Adiciona vírgula se não for a primeira linha de dados
                }

                String[] infoAula = line.split(";"); // Divide a linha em colunas usando ";"
                Map<String, Object> jsonMap = new LinkedHashMap<>();

                for (int i = 0; i < colunas.length; i++) {
                    String value = (i < infoAula.length) ? infoAula[i] : "";
                    if ("Inscritos no Turno".equals(colunas[i])) {
                        try {
                            int numero = Integer.parseInt(value);
                            jsonMap.put(colunas[i], numero);
                        } catch (NumberFormatException e) {
                            jsonMap.put(colunas[i], null);
                        }
                    } else if ("Data da aula".equals(colunas[i])) {
                        if (!value.isEmpty()) {
                            String[] split_date = value.split("/");
                            String data_invertida = split_date[2] + "/" + split_date[1] + "/" + split_date[0];

                            jsonMap.put(colunas[i], data_invertida);
                            jsonMap.put("Semana do ano", getSemanaAno(value));
                            jsonMap.put("Semana do semestre", getSemanaSemestre(value));
                        } else {
                            jsonMap.put(colunas[i], "");
                            jsonMap.put("Semana do ano", null);
                            jsonMap.put("Semana do semestre", null);
                        }
                    } else {
                        jsonMap.put(colunas[i], value);
                    }
                }

                String gson = new GsonBuilder().setPrettyPrinting().create().toJson(jsonMap);
                writer.write(gson);

                isFirstLine = false;
            }

            writer.write("\n]\n");
            System.out.println("Arquivo JSON gerado com sucesso.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void addRoomReservation(Aula aula) {
        Map<String, Object> reservation = new LinkedHashMap<>();
        reservation.put("Curso", aula.getCurso());
        reservation.put("Unidade Curricular", aula.getUnidadeCurricular());
        reservation.put("Turno", aula.getTurno());
        reservation.put("Turma", aula.getTurma());
        reservation.put("Inscritos no Turno", aula.getInscritosNoTurno());
        reservation.put("Dia da Semana", aula.getDiaSemana());
        reservation.put("Hora Inicio da Aula", aula.getHoraInicioAula());
        reservation.put("Hora Fim da Aula", aula.getHoraFimAula());
        reservation.put("Data da aula", aula.getDataAula());
        reservation.put("Caracteristicas da sala pedida para a aula", aula.getCaracteristicasSala());
        reservation.put("Sala atribuida a aula", aula.getSalaAtribuida());

        try (FileWriter writer = new FileWriter(outputJsonFile, true)) {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            gson.toJson(reservation, writer);
            writer.write("\n");
            System.out.println("Reserva de sala adicionada com sucesso.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private int getSemanaAno(String data) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date dataAula = dateFormat.parse(data);
            Calendar calendar = Calendar.getInstance(Locale.getDefault());
            calendar.setFirstDayOfWeek(Calendar.MONDAY);
            calendar.setTime(dataAula);
            return calendar.get(Calendar.WEEK_OF_YEAR);
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }
    }

    private long getSemanaSemestre(String data) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date givenDate = sdf.parse(data);
            Calendar referenceDateFirstSemester = Calendar.getInstance();
            referenceDateFirstSemester.setTime(sdf.parse("01/09/2022"));
            Calendar referenceDateSecondSemester = Calendar.getInstance();
            referenceDateSecondSemester.setTime(sdf.parse("01/02/2023"));
            Calendar givenDateCal = Calendar.getInstance();
            givenDateCal.setTime(givenDate);

            if (givenDateCal.get(Calendar.MONTH) >= Calendar.SEPTEMBER
                    || givenDateCal.get(Calendar.MONTH) == Calendar.JANUARY) {
                long diffInMillies = givenDateCal.getTimeInMillis() - referenceDateFirstSemester.getTimeInMillis();
                return (long) Math.ceil((TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS) / 7));
            } else {
                long diffInMillies = givenDateCal.getTimeInMillis() - referenceDateSecondSemester.getTimeInMillis();
                return (long) Math.ceil((TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS) / 7));
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }
    }
}
