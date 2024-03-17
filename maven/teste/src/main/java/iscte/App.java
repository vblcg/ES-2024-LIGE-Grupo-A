package iscte;

import java.io.File;

/**
 * Classe onde a APP deve ser corrida.
 * Começa por guardar as versões mais recentes dos ficheiros html.
 * Depois, instancia o 'upload' de um ficheiro, atraves da interface grafica.
 */
public class App {
    
    /** 
     * @param args
     */
    public static void main(String[] args) {
        File[] fileHolder = new File[1]; 
        String jsonFile = "ficheiros/Horário.json";
        UserUploadFile uploadFile = new UserUploadFile(fileHolder, jsonFile); 
        uploadFile.setVisible(true); 
    }
}