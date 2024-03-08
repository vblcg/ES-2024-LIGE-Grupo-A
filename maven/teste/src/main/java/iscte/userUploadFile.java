package iscte;

import javax.swing.*;
import java.io.File;
import java.awt.event.*;

public class userUploadFile extends JFrame implements FileCallback{

    private FileCallback callback;
    private File[] fileholder;

    public userUploadFile(File[] fileholder, String jsonFile) {
        this.fileholder =  fileholder;
        this.callback = new FileCallback() {
            public void onFileSelected(File selectedFile) {
                fileholder[0] = selectedFile;
                extract extractorCsvToJson = new extract(fileholder, jsonFile);
                extractorCsvToJson.readCsvUsingBufferReader();
                return;
            }
        };

        setTitle("File Chooser Example");
        setSize(400, 300);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        JButton button = new JButton("Open File Chooser");
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                openFileChooser();
            }
        });

        JPanel panel = new JPanel();
        panel.add(button);
        add(panel);
    }

    private void openFileChooser() {
        JFileChooser fileChooser = new JFileChooser();
        int returnValue = fileChooser.showOpenDialog(null);

        if (returnValue == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            System.out.println("Selected file: " + selectedFile.getAbsolutePath());
            callback.onFileSelected(selectedFile);
        } else {
            System.out.println("No file selected.");
        }
    }

    @Override
    public void onFileSelected(File selectedFile) {
        this.fileholder[0] = selectedFile;
    }
}


