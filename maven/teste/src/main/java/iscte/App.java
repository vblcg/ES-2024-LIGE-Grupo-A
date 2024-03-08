package iscte;

import java.io.File;

public class App {
    public static void main(String[] args) {
        File[] fileHolder = new File[1]; 
        String jsonFile = "output.json";
        userUploadFile uploadFile = new userUploadFile(fileHolder, jsonFile); 
        uploadFile.setVisible(true); 

        while (fileHolder[0] == null) {
            try {
                Thread.sleep(1000); 
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
