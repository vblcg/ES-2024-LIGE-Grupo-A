package iscte;

import java.io.File;

public class App {
    public static void main(String[] args) {
        File[] fileHolder = new File[1]; 
        String jsonFile = "output.json";
        XamppFileManager.saveToFileRoot(new File("SalasDeAulaPorTipospontoDeSala.html"));
        UserUploadFile uploadFile = new UserUploadFile(fileHolder, jsonFile); 
        uploadFile.setVisible(true); 
    }
}