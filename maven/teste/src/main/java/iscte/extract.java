package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import com.google.gson.GsonBuilder;


public class extract{
    private String outputFile;
    private File[] holder;

    public extract(File[] holder, String outputFile) {
        this.outputFile = outputFile;
        this.holder = holder;
    }

    public String getOutputFile() {
        return outputFile;
    }

    public File[] getHolder() {
        return holder;
    }

    public void readCsvUsingBufferReader(){

        String line = "";
        String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana", 
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
                    String value = (i < infoAula.length) ? infoAula[i] : ""; // Replace null with empty string
                    if ("Inscritos no Turno".equals(colunas[i])) {
                        try {
                            int numero = Integer.parseInt(value);
                            jsonMap.put(colunas[i], numero);
                        } catch (NumberFormatException e) {
                            // Handle parsing error
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
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}