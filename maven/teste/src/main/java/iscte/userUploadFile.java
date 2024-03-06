package iscte;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

public class userUploadFile extends JFrame {
    private String filename;
    private File file;
    
    public userUploadFile() {
        this.filename = upload();
    }

    public String upload() {
        setTitle("Carregar Ficheiro");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 200);
        JButton btnLoadFile = new JButton("Carregar Ficheiro");
        btnLoadFile.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                
                JFileChooser fileChooser = new JFileChooser();
                int returnValue = fileChooser.showOpenDialog(null);
                if (returnValue == JFileChooser.APPROVE_OPTION) {
                     file = fileChooser.getSelectedFile();
                    //VER SE O FICHEIRO É CSV
                    System.out.println("Ficheiro selecionado: " + file.getAbsolutePath());
                }
               
            }
        });

        JPanel panel = new JPanel();
        panel.add(btnLoadFile);
        add(panel);

        setVisible(true);
        return file.getAbsolutePath();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                userUploadFile upload = new userUploadFile();
            }
        });
    }
}
