package iscte;

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

    private List<Map<String, String>> createJsonData(List<String[]> csvData) {
        List<Map<String, String>> jsonData = new ArrayList<>();

        if (!csvData.isEmpty()) {
            String[] headers = csvData.remove(0);

        // Create a list to store the headers
        List<Map<String, String>> headerList = new ArrayList<>();
        Map<String, String> headerMap = new HashMap<>();
        for (String header : headers) {
            headerMap.put(header, header);
        }
        headerList.add(headerMap);
        jsonData.add((Map<String, String>) headerList);

        // Create a list to store the rows
        List<Map<String, String>> rowList = new ArrayList<>();

        for (String[] row : csvData) {
            // Create a map to represent each row with header-value pairs
            Map<String, String> rowMap = new HashMap<>();

            for (int i = 0; i < headers.length; i++) {
                String header = headers[i];
                String value = (i < row.length) ? row[i] : ""; // Use an empty string if no value is present

                rowMap.put(header, value);
            }

            // Add each map to the rowList
            rowList.add(rowMap);
        }

        // Add the rowList to the jsonData
        jsonData.add((Map<String, String>) rowList);
    }

    return jsonData;
}
}
