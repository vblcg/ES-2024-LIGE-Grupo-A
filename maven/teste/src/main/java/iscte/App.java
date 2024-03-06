package iscte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class App {
    public static void main(String[] args) {
        File[] fileHolder = new File[1];

        userUploadFile.getFileFromUser((selectedFile) -> {
            System.out.println("Selected file: " + selectedFile.getAbsolutePath());
            fileHolder[0] = new File(selectedFile.getAbsolutePath()); 
        });

        if (fileHolder[0] != null) {
            try (BufferedReader reader = new BufferedReader(new FileReader(fileHolder[0]))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line); // Print each line of the file
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No file selected.");
        }
    }
}
