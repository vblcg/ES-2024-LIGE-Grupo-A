package iscte;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;

public class csvToJson{
    private String outputFile;
    private File[] holder;

    public csvToJson(File[] holder, String outputFile) {
        this.outputFile = outputFile;
        this.holder = holder;
    }

    public void extract() {
        if (this.holder[0] != null) {
            try (CSVReader reader = new CSVReader(new FileReader(this.holder[0]))) {
                List<String[]> csvData = reader.readAll();
                List<String[]> newData = new ArrayList<>();

                for(int line = 0; line < csvData.size(); line++) {
                    String[] columns = csvData.get(line)[0].split(";");
                    newData.add(columns);
                }
                
                String[] columnsValues = newData.remove(0);
                List<String[]> jsonFormat = new ArrayList<String[]>();

                for(int newLines = 0; newLines < newData.size(); newLines++) {
                    jsonFormat.
                }

                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                FileWriter writer = new FileWriter(outputFile);
                gson.toJson(newData, writer);


                
                writer.close();
            } catch (IOException | CsvException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No file selected.");
        }
    }
}