package iscte;

import javax.swing.*;
import java.io.File;

public class userUploadFile {
    
    
    /** 
     * @param callback
     */
    public static void getFileFromUser(FileCallback callback) {
        JFileChooser fileChooser = new JFileChooser();

        int returnValue = fileChooser.showOpenDialog(null);

        if (returnValue == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            if (callback != null) {
                callback.onFileSelected(selectedFile);
            }
        } else {
            System.out.println("No file selected.");
        }
    }

    interface FileCallback {
        void onFileSelected(File selectedFile);
    }
}
