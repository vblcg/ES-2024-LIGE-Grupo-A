package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
//import com.google.gson.GsonBuilder;

/**
 * Esta classe tem com funcionalidade ler o ficheiro CSV que contém o horário das aulas e convertê-lo num ficheiro com formato JSON
 */
public class Extract{
    private static String outputFile;
    private static String inputFile;

    /**
     * Main, que cria uma instância da classe Extract, com o ficheiro CSV de input e o ficheiro JSON de output desejado e invoca a função
     * de conversão
     *
     * @param args - Argumento não usado
     */
    public static void main(String[] args) {
        Extract teste = new Extract("HorarioDeExemplo.csv", "output.json");
        teste.readCsvUsingBufferReader();
    }

    /**
     * Contrutor do objeto Extract
     *
     * @param inputFile - String que representa o ficheiro CSV de input.
     * @param outputFile - String que representa o ficheiro de output.
     */
    public Extract(String inputFile, String outputFile) {
        this.outputFile = outputFile;
        this.inputFile = inputFile;
    }

    /**
     * Lê um ficheiro CSV, recorrendo a um BufferedREader, analisa o seu conteúdo e escreve toda a informação em 
     * um ficheiro JSON. Calcula também a semana do ano e a semana do semestre, recorrendo à data das aulas, e adiciona
     * esta informação extra a cada registo do ficheiro JSON.
     */
    public static void readCsvUsingBufferReader(){

        String line = "";
        String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana", 
                            "Hora Início da Aula", "Hora Fim da Aula", "Data da aula", 
                            "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};

        try (BufferedReader reader = new BufferedReader(new FileReader(inputFile)); 
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
                            // Handle parsing error
                            jsonMap.put(colunas[i], null);
                        }
                    } if ("Data da aula".equals(colunas[i])) {
                        try {
                            if(value == null || value == ""){
                                jsonMap.put(colunas[i], value);
                                jsonMap.put("Semana do ano", null);
                            } else {
                                String[] split_date = value.split("/");
                                String data_invertida = split_date[2] + "/" + split_date[1] + "/" + split_date[0];
                                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                                Date dataAula = dateFormat.parse(value);
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(dataAula);
                                int semana_do_ano = calendar.get(Calendar.WEEK_OF_YEAR);

                                jsonMap.put(colunas[i], data_invertida);
                                jsonMap.put("Semana do ano", semana_do_ano);
                                
                            }
                            
                            
                        } catch (NumberFormatException e) {
                            // Handle parsing error
                            
                        } catch (ParseException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
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
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
