package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

                BufferedReader reader = new BufferedReader(new FileReader())

                List<Map<String, String>> jsonData = createJsonData(csvData);

                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                FileWriter writer = new FileWriter(outputFile);
                gson.toJson(jsonData, writer);

                writer.close();
            } catch (IOException | CsvException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No file selected.");
        }
    }
}
