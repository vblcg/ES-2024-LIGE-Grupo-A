package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.google.gson.GsonBuilder;

/**
 * Esta classe tem com funcionalidade ler o ficheiro CSV que contem o horario das aulas e converte-lo num ficheiro com formato JSON
 */
public class Extract{
    private String outputFile;
    private File[] inputFile;
    private File outputJsonFile;

    /**
     * Contrutor do objeto Extract
     *
     * @param inputFile String que representa o ficheiro CSV de input.
     * @param outputFile String que representa o ficheiro de output.
     */
    public Extract(File[] inputFile, String outputFile) {
        this.outputFile = outputFile;
        this.inputFile = inputFile;
        this.outputJsonFile = new File(outputFile);
    }

    /** 
     * @return File
     */
    public File getOutputJsonFile() {
        return outputJsonFile;
    }

    /**
     * Obtém o path do ficheiro de output.
     * @return O path do ficheiro de ouput.
     */
    public String getOutputFile() {
        return outputFile;
    }


    /**
     * Obtém o path do ficheiro de input.
     * @return O path do ficheiro de input.
     */
    public String getInputFile() {
        return inputFile[0].getPath();
    }

    /**
     * Obtém o array de objetos File representando os arquivos CSV de entrada.
     *
     * @return Um array de objetos File representando os arquivos CSV de entrada.
     */

     public File[] getHolder() {
        return inputFile;
    }

    /**
     * @param data Data no formato "DD/MM/AAAA"
     * @return Número da semana do ano da "data"
     */
    public int getSemanaAno(String data){
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
    public long getSemanaSemestre(String data) {
        
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
                diffInWeeks = (long) (Math.ceil((TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS) / 7)) + 1);
            } else {
                long diffInMillies = givenDateCal.getTimeInMillis() - referenceDateSecondSemester.getTimeInMillis();
                diffInWeeks = (long) (Math.ceil((TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS) / 7)) + 1);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return diffInWeeks;
    }
    /**
     * Lê um ficheiro CSV, recorrendo a um BufferedREader, analisa o seu conteúdo e escreve toda a informação em 
     * um ficheiro JSON. Calcula também a semana do ano e a semana do semestre, recorrendo à data das aulas, e adiciona
     * esta informação extra a cada registo do ficheiro JSON.
     */
    public void readCsvUsingBufferReader(){

        String line = "";
        String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana", 
                            "Hora Inicio da Aula", "Hora Fim da Aula", "Data da aula", 
                            "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(getHolder()[0]), Charset.defaultCharset())); 
            FileWriter writer = new FileWriter(new File(outputFile))) {

            writer.write("[\n");

            line = reader.readLine();
            boolean isLastRecord = false;

            while((line = reader.readLine()) != null){
                isLastRecord = !reader.ready();
                
                String[] infoAula = line.split(";");
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
                    } if ("Data da aula".equals(colunas[i])) {
                    
                            if(value == null || value == ""){
                                jsonMap.put(colunas[i], value);
                                jsonMap.put("Semana do ano", null);
                            } else {
                                // Inverter a data para o formato "AAAA/MM/DD"
                                String[] split_date = value.split("/");
                                String data_invertida = split_date[2] + "/" + split_date[1] + "/" + split_date[0];

                                int semana_ano_func = getSemanaAno(value);

                                jsonMap.put(colunas[i], data_invertida);
                                jsonMap.put("Semana do ano", semana_ano_func);

                                int semana_semestre_func = (int)getSemanaSemestre(value);
                                
                                jsonMap.put(colunas[i], data_invertida);
                                jsonMap.put("Semana do semestre", semana_semestre_func);
                        }
                            
                    } else {
                        jsonMap.put(colunas[i], value);
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