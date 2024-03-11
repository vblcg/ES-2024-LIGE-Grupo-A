package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import com.google.gson.GsonBuilder;

/**
 * A classe Extract é responsável por ler informações de um arquivo CSV, processá-las e criar um ficheiro JSON.
 * Usa um BufferedReader para ler o arquivo CSV, processa os dados e escreve o JSON num ficheiro.
 * O ficheiro CSV deve conter informações sobre cursos, turmas, horários e detalhes relacionados.
 *
 * @version 1.0
 */


public class Extract{
    private String outputFile;
    private File[] holder;

    /**
     * Constrói um objeto Extract com o array especificado de objetos File e o nome do ficheiro criado para armazenar os dados processados no formato JSON.
     *
     * @param holder      Um array de objetos File com os arquivos CSV de entrada.
     * @param outputFile  O nome do ficheiro para armazenar os dados em JSON.
     */

    public Extract(File[] holder, String outputFile) {
        this.outputFile = outputFile;
        this.holder = holder;
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
     * Lê o arquivo CSV usando BufferedReader, processa os dados e gera um arquivo JSON como saída.
     */

    public void readSalasCsv(){
        String line = "";
        String[] titles = {
            "Edificio", "Nome sala", "Capacidade Normal", "Capacidade Exame", "Nº características",
            "Anfiteatro aulas", "Apoio técnico eventos", "Arq 1", "Arq 2", "Arq 3",
            "Arq 4", "Arq 5", "Arq 6", "Arq 9", "BYOD (Bring Your Own Device)", "Focus Group",
            "Horário sala visível portal público", "Laboratório de Arquictetura de Computadores I",
            "Laboratório de Arquictetura de Computadores II", "Laboratório de Base de Engenharia",
            "Laboratório de Eletrónica", "Laboratório de Informática", "Laboratório de Jornalismo",
            "Laboratório de Redes de Computadores I", "Laboratório de Redes de Computadores II",
            "Laboratório de Telecomunicações", "Sala Aulas Mestrado", "Sala Aulas Mestrado Plus",
            "Sala NEE", "Sala Provas", "Sala Reunião", "Sala de Arquitetura", "Sala de Aulas normal",
            "videoconferência", "átrio"
        };
        try (BufferedReader reader = new BufferedReader(new FileReader(getHolder()[0])); 
        FileWriter writer = new FileWriter(new File(getOutputFile()))) {
        
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
    


    public void readCsvUsingBufferReader(){

        String line = "";
        String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no turno", "Dia da Semana", 
                            "Hora Início da Aula", "Hora Fim da Aula", "Data da aula", 
                            "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};


        try (BufferedReader reader = new BufferedReader(new FileReader(getHolder()[0])); 
            FileWriter writer = new FileWriter(new File(getOutputFile()))) {
            
            writer.write("[\n");
            line = reader.readLine();
            boolean isLastRecord = false;

            while((line = reader.readLine()) != null){ 
                isLastRecord = !reader.ready(); // Check if there is no next line
                
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

    public static void main(String[] args) {
        File[] fileholder = new File[1];
        fileholder[0] = new File("CaracterizaçãoDasSalas.csv");
        Extract extractorCsvToJson = new Extract(fileholder, "CaracterizaçãoDasSalas.json");
        extractorCsvToJson.readSalasCsv();
    }
}