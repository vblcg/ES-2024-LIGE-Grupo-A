package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
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