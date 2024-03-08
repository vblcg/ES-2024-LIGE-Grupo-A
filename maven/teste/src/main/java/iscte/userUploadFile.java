package iscte;

import javax.swing.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.awt.Desktop;
import java.awt.event.*;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class UserUploadFile extends JFrame implements FileCallback{

    private FileCallback callback;
    private File[] fileholder;
    JPanel panel;

    public UserUploadFile(File[] fileholder, String jsonFile) {
        this.fileholder =  fileholder;
        this.callback = new FileCallback() {
            public void onFileSelected(File selectedFile) {
                fileholder[0] = selectedFile;
                Extract extractorCsvToJson = new Extract(fileholder, jsonFile);
                extractorCsvToJson.readCsvUsingBufferReader();
                return;
            }
        };

        setTitle("File Chooser");
        setSize(400, 300);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        //Botão carregamento ficheiro local
        JButton button = new JButton("Carregar Horário Localmente");
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                openFileChooser();
            }
        });

        //Botão carregamento a partir do github
        JButton buttonGitHub = new JButton("Carregar Horário GitHub");
        buttonGitHub.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String input = JOptionPane.showInputDialog(panel, "Colar Link:");
                if(input == null)  
                    JOptionPane.showMessageDialog(panel,"Não colocou nenhum endereço", "Erro", JOptionPane.INFORMATION_MESSAGE);
                else
                    openGitHubFileChooser(input);
            }
        });

        //Botão ver salas no browser
        JButton buttonWebBrowser = new JButton("Mostrar Salas no Browser");  
	    button.setBounds(20,20,250,50);  
	    buttonWebBrowser.addActionListener(new ActionListener(){  	
			public void actionPerformed(ActionEvent e){  
				Desktop desk = Desktop.getDesktop(); 
				try {
					desk.browse(new java.net.URI("file://" + System.getProperty("user.dir") + "/" + "SalasDeAulaPorTiposDeSala.html"));
				} catch (IOException | URISyntaxException e1) {
                    e1.printStackTrace();
                } 
			}
        });

        panel = new JPanel();
        panel.add(button);
        panel.add(buttonGitHub);
        panel.add(buttonWebBrowser);
        add(panel);
    }

    public File[] getFileholder() {
        return fileholder;
    }

    //Escolher ficheiro localmente
    public void openFileChooser() {
        JFileChooser fileChooser = new JFileChooser();
        int returnValue = fileChooser.showOpenDialog(null);

        if (returnValue == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            if (selectedFile.getName().toLowerCase().endsWith(".csv")) {
                callback.onFileSelected(selectedFile);
            } else {
                 JOptionPane.showMessageDialog(panel, "O arquivo selecionado não é um arquivo CSV.", "Erro", JOptionPane.ERROR_MESSAGE);
            }
        } else {
            System.out.println("No file selected.");
        }
    }

    //Escolher ficheiro no github
    public void openGitHubFileChooser(String input) {
        String githubFileUrl = input;
        File selectedFile = downloadFileFromGitHub(githubFileUrl);

        if (selectedFile != null && input.toLowerCase().startsWith("https://raw.githubusercontent") && input.toLowerCase().endsWith(".csv")) {
            callback.onFileSelected(selectedFile);
        } else if(!selectedFile.getName().toLowerCase().endsWith(".csv")) {
            JOptionPane.showMessageDialog(panel,
                        "O arquivo selecionado não é um arquivo CSV.",
                        "Erro",
                        JOptionPane.ERROR_MESSAGE);
        } else if(!input.toLowerCase().startsWith("https://raw.githubusercontent")){
            JOptionPane.showMessageDialog(panel,
                        "O arquivo selecionado não é um ficheiro do GitHub.",
                        "Erro",
                        JOptionPane.ERROR_MESSAGE);
        }
    }

    //Descarregar ficheiro github 
    public File downloadFileFromGitHub(String githubFileUrl) {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(githubFileUrl)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String fileName = githubFileUrl.substring(githubFileUrl.lastIndexOf('/') + 1);
                String destinationFilePath = fileName;
                File downloadedFile = new File(destinationFilePath);

                try (FileOutputStream outputStream = new FileOutputStream(downloadedFile)) {
                    outputStream.write(response.body().bytes());
                    return downloadedFile;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void onFileSelected(File selectedFile) {
        this.fileholder[0] = selectedFile;
    }
}