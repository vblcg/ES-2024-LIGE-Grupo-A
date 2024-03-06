package iscte;
import java.io.File;

public class App {
    public static void main(String[] args) {
        File[] fileHolder = new File[1];
        String jsonFile = "output.json";
        userUploadFile.getFileFromUser((selectedFile) -> {fileHolder[0] = new File(selectedFile.getAbsolutePath()); });
        csvToJson extractorCsvToJson = new csvToJson(fileHolder, jsonFile);
        extractorCsvToJson.extract();
    }
}
