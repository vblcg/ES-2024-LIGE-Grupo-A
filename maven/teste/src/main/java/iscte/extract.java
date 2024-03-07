package iscte;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;

public class extract{
    private String outputFile;
    private File[] holder;

    public extract(File[] holder, String outputFile) {
        this.outputFile = outputFile;
        this.holder = holder;
    }

    public void extract() {
        if (this.holder[0] != null) {
            try (CSVReader reader = new CSVReader(new FileReader(this.holder[0]))) {
                List<String[]> csvData = reader.readAll();

                String[] headers = csvData.remove(0);
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                FileWriter writer = new FileWriter(outputFile);
                gson.toJson(csvData, writer);

                writer.close();
            } catch (IOException | CsvException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No file selected.");
        }
    }
}
