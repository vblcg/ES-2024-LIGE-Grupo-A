package iscte;

import javax.swing.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.text.Normalizer;
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
                try {
                    openFileChooser();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
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
                    try {
                        openGitHubFileChooser(input);
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    }
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
    public void openFileChooser() throws IOException {
        JFileChooser fileChooser = new JFileChooser();
        int returnValue = fileChooser.showOpenDialog(null);
        if (returnValue == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            String git = "";
            checkCsvStructure(selectedFile, git);
        } else {
            JOptionPane.showMessageDialog(panel,"Não Selecionou Nenhum Ficheiro", "", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    //Escolher ficheiro no github
    public void openGitHubFileChooser(String input) throws IOException {
        String githubFileUrl = input;
        downloadFileFromGitHub(githubFileUrl);
    }

    //Descarregar ficheiro github 
    public File downloadFileFromGitHub(String githubFileUrl) {
        if (!githubFileUrl.toLowerCase().startsWith("http://") && !githubFileUrl.toLowerCase().startsWith("https://") && !githubFileUrl.toLowerCase().endsWith(githubFileUrl)) {
            JOptionPane.showMessageDialog(panel, "URL inválida. Certifique-se de incluir 'http://' ou 'https://'.", "Erro", JOptionPane.ERROR_MESSAGE);
            return null;
        }

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(githubFileUrl).build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String fileName = githubFileUrl.substring(githubFileUrl.lastIndexOf('/') + 1);
                String destinationFilePath = fileName;
                File downloadedFile = new File(destinationFilePath);
                checkCsvStructure(downloadedFile, githubFileUrl);
                try (FileOutputStream outputStream = new FileOutputStream(downloadedFile)) {
                    outputStream.write(response.body().bytes());
                    return downloadedFile;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(panel, "A Estrutura do Horário Está Errada.", "Erro", JOptionPane.ERROR_MESSAGE);
            return null;
        }
        return null;
    }

    public void checkCsvStructure(File file, String git) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
        String[] columns = reader.readLine().split(";");
        String[] expected = {"Curso", "Unidade Curricular", "Turno", "Turma", "Inscritos no turno", "Dia da semana", "Hora início da aula", "Hora fim da aula", "Data da aula", "Características da sala pedida para a aula", "Sala atribuída à aula"};
        if (file.getName().toLowerCase().endsWith(".csv")) {
            if (columns.length == expected.length) {
                boolean structureCorrect = true;
                for (int i = 0; i < columns.length; i++) {
                    String normalizedString1 = Normalizer.normalize(columns[i].toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
                    String normalizedString2 = Normalizer.normalize(expected[i].toLowerCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
                    if (!normalizedString1.equals(normalizedString2)) {
                        structureCorrect = false;
                        break;
                    }
                }
                if (structureCorrect) {
                    JOptionPane.showMessageDialog(panel, "Horário Carregado!", "Sucesso", JOptionPane.PLAIN_MESSAGE);
                    callback.onFileSelected(file);
                } else {
                    JOptionPane.showMessageDialog(panel, "A Estrutura do Horário Está Errada.", "Erro", JOptionPane.ERROR_MESSAGE);
                }
                if ((git != "") && (!git.toLowerCase().startsWith("https://raw.githubusercontent"))) {
                    JOptionPane.showMessageDialog(panel, "O arquivo selecionado não é um ficheiro do GitHub.", "Erro", JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(panel, "A Estrutura do Horário Está Errada.", "Erro", JOptionPane.ERROR_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(panel, "O arquivo selecionado não é um arquivo CSV.", "Erro", JOptionPane.ERROR_MESSAGE);
        }
        
        reader.close();
    }

    @Override
    public void onFileSelected(File selectedFile) {
        this.fileholder[0] = selectedFile;
    }
}