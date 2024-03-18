package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import com.google.gson.GsonBuilder;

/**
 * Responsável por ler um arquivo CSV, processa-lo e criar um ficheiro JSON.
 * Usa um BufferedReader para ler o arquivo CSV, processa os dados e escreve o JSON num ficheiro.
 * O ficheiro CSV deve conter informações sobre cursos, turmas, horarios e detalhes relacionados.
 *
 * @version 1.0
 */
public class Extract{
    private String outputFile;
    private File[] holder;
    private File outputJsonFile;


    /**
     * Constrói um objeto Extract com o array especificado de objetos File e o nome do ficheiro criado para armazenar os dados processados no formato JSON.
     *
     * @param holder      Um array de objetos File com os arquivos CSV de entrada.
     * @param outputFile  O nome do ficheiro para armazenar os dados em JSON.
     */

    public Extract(File[] holder, String outputFile) {
        this.outputFile = outputFile;
        this.holder = holder;
        this.outputJsonFile = new File(outputFile);
    }
    
    /**
     * Obtém o nome do ficheiro json.
     *
     * @return O nome do ficheiro json.
     */
    public String getOutputFile() {
        return outputFile;
    }

    /**
     * Obtém o array de objetos File representando os arquivos CSV de entrada.
     *
     * @return Um array de objetos File representando os arquivos CSV de entrada.
     */

    public File[] getHolder() {
        return holder;
    }


    /** 
     * @return File
     */
    public File getOutputJsonFile() {
        return outputJsonFile;
    }

    /**
     * @param data Data no formato "DD/MM/AAAA"
     * @return Número da semana do ano da "data"
     */
    public static int getSemanaAno(String data){
        int semana_do_ano = 0;
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        Date dataAula;
        try {
            dataAula = dateFormat.parse(data);
            Calendar calendar = Calendar.getInstance(Locale.getDefault());
            calendar.setFirstDayOfWeek(Calendar.MONDAY); // Definir segunda como o primeiro dia da semana
            calendar.setTime(dataAula);
            semana_do_ano = calendar.get(Calendar.WEEK_OF_YEAR);
        } catch (ParseException e) {
            e.printStackTrace();
            return -1;
        }

        return semana_do_ano;
    }

    /**
     * @param data Data no formato "DD/MM/AAAA"
     * @return  Numero da semana do semestre calculado com base na data "02/09/2022"
     * Temporario
     */
    public static long getSemanaSemestre(String data) {
        
        // Define SimpleDateFormat object with pattern
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        long diffInWeeks = 0;
        
        try {
            // Parse the given date string to Date object
            Date givenDate = sdf.parse(data);
            
            // Set the reference date to 09/02/2022
            Calendar referenceDateFirstSemester = Calendar.getInstance();
            referenceDateFirstSemester.setTime(sdf.parse("01/09/2022"));
            
            Calendar referenceDateSecondSemester = Calendar.getInstance();
            referenceDateSecondSemester.setTime(sdf.parse("01/02/2023"));

            // Set the given date to Calendar object
            Calendar givenDateCal = Calendar.getInstance();
            givenDateCal.setTime(givenDate);
            
            // Calculate the difference in weeks
            if (givenDateCal.get(Calendar.MONTH) >= Calendar.SEPTEMBER || givenDateCal.get(Calendar.MONTH) == Calendar.JANUARY) {
                long diffInMillies = givenDateCal.getTimeInMillis() - referenceDateFirstSemester.getTimeInMillis();
                diffInWeeks = (long) Math.ceil((TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS) / 7));
            } else {
                long diffInMillies = givenDateCal.getTimeInMillis() - referenceDateSecondSemester.getTimeInMillis();
                diffInWeeks = (long) Math.ceil((TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS) / 7));
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return diffInWeeks;
    }

    /**
     * Lê o arquivo CSV usando BufferedReader, processa os dados e gera um arquivo JSON como saída.
     */
    public void readCsvUsingBufferReader(){

        String line = "";
        String[] titles = {"Curso", "UC", "Turno", "Turma", "Inscritos no turno", "Dia da Semana", 
                           "Hora Inicio da Aula", "Hora Fim da Aula", "Data da aula", 
                            "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(getHolder()[0]), StandardCharsets.UTF_8));
        FileWriter writer = new FileWriter(getOutputJsonFile(), StandardCharsets.UTF_8)) {
            
            writer.write("[\n");
            line = reader.readLine();
            boolean isLastRecord = false;

            while((line = reader.readLine()) != null){ 
                isLastRecord = !reader.ready(); // Check if there is no next line
                
                String[] infoAula = line.split(";");
                Map<String, Object> jsonMap = new LinkedHashMap<>();

                for (int i = 0; i < titles.length; i++) {
                    String value = (i < infoAula.length) ? infoAula[i] : ""; 
                    if ("Inscritos no Turno".equals(titles[i])) {
                        try {
                            int numero = Integer.parseInt(value);
                            jsonMap.put(titles[i], numero);
                        } catch (NumberFormatException e) {
                            jsonMap.put(titles[i], null);
                        }
                    } else {
                        jsonMap.put(titles[i], value);
                    }
                }
    
                String gson =(new GsonBuilder().setPrettyPrinting().create().toJson(jsonMap));

                if (isLastRecord) {
                    writer.write(gson + "\n");
                } else {
                    writer.write(gson + ",\n");
                }
            }
            writer.write("]\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}