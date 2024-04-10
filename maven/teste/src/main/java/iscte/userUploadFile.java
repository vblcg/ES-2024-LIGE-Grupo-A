package iscte;

import javax.swing.*;
import java.awt.Desktop;
import java.awt.event.*;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class UserUploadFile extends JFrame {

    private File[] fileholder;
    private JPanel panel;
    private boolean uploaded;

    public UserUploadFile(File[] fileholder, String jsonFile) {
        this.fileholder = fileholder;

        setTitle("File Chooser");
        setSize(400, 300);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        // Inicialização dos botões...
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
        JButton buttonGitHub = new JButton("Carregar Horário GitHub");
        buttonGitHub.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String input = JOptionPane.showInputDialog(panel, "Colar Link:");
                if (input == null) {
                    JOptionPane.showMessageDialog(panel, "Não colocou nenhum endereço", "Erro",
                            JOptionPane.INFORMATION_MESSAGE);
                } else {
                    checkLinkStructure(input);
                }
            }
        });
        JButton buttonWebBrowser = new JButton("Mostrar Salas no Browser");
        buttonWebBrowser.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (!uploaded) {
                    JOptionPane.showMessageDialog(panel, "Ainda não carregou nenhum horário!", "Erro",
                            JOptionPane.INFORMATION_MESSAGE);
                } else {
                    openWebPage("http://localhost/SalasDeAulaPorTiposDeSala.html");
                }
            }
        });
        JButton buttonSchedule = new JButton("Mostrar Horário no Browser");
        buttonSchedule.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (!uploaded) {
                    JOptionPane.showMessageDialog(panel, "Ainda não carregou nenhum horário!", "Erro",
                            JOptionPane.INFORMATION_MESSAGE);
                } else {
                    openWebPage("http://localhost/Horário.html");
                }
            }
        });
        JButton buttonAllocate = new JButton("Agendamento De Aulas");
        buttonAllocate.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (!uploaded) {
                    JOptionPane.showMessageDialog(panel, "Ainda não carregou nenhum horário!", "Erro",
                            JOptionPane.INFORMATION_MESSAGE);
                } else {
                    openWebPage("http://localhost/AgendamentoDeAulas.html");
                }
            }
        });

        panel = new JPanel();
        panel.add(buttonSchedule);
        panel.add(button);
        panel.add(buttonGitHub);
        panel.add(buttonWebBrowser);
        panel.add(buttonAllocate);

        add(panel);
    }

    public void openFileChooser() throws IOException {
        JFileChooser fileChooser = new JFileChooser();
        int returnValue = fileChooser.showOpenDialog(null);
        if (returnValue == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            checkCsvStructure(selectedFile);
        } else {
            JOptionPane.showMessageDialog(panel, "Não Selecionou Nenhum Ficheiro", "", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    public void checkLinkStructure(String githubFileUrl) {
        if (!githubFileUrl.toLowerCase().startsWith("http://") && !githubFileUrl.toLowerCase().startsWith("https://")) {
            JOptionPane.showMessageDialog(panel, "URL inválida. Certifique-se de incluir 'http://' ou 'https://'.",
                    "Erro", JOptionPane.ERROR_MESSAGE);
            return;
        } else if ((githubFileUrl != "")
                && (!githubFileUrl.toLowerCase().startsWith("https://raw.githubusercontent"))) {
            JOptionPane.showMessageDialog(panel, "O ficheiro selecionado não é do GitHub ou não é 'raw'.", "Erro",
                    JOptionPane.ERROR_MESSAGE);
        } else if (!githubFileUrl.toLowerCase().endsWith(".csv")) {
            JOptionPane.showMessageDialog(panel, "O arquivo selecionado não é um arquivo CSV.", "Erro",
                    JOptionPane.ERROR_MESSAGE);
        } else {
            downloadFileFromGitHub(githubFileUrl);
        }
    }

    public File downloadFileFromGitHub(String githubFileUrl) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(githubFileUrl).build();
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String fileName = githubFileUrl.substring(githubFileUrl.lastIndexOf('/') + 1);
                String destinationFilePath = "ficheiros/" + fileName;
                File downloadedFile = new File(destinationFilePath);
                try (FileOutputStream outputStream = new FileOutputStream(downloadedFile)) {
                    outputStream.write(response.body().bytes());
                    checkCsvStructure(downloadedFile);
                    return downloadedFile;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Error writing file: " + e.getMessage());
            JOptionPane.showMessageDialog(panel, "Não foi possível descarregar o ficheiro. Tente novamente", "Erro",
                    JOptionPane.ERROR_MESSAGE);
        }
        return null;
    }

    public void checkCsvStructure(File file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"))) {
            String[] columns = reader.readLine().split("[;,]");
            String[] expected = { "Curso", "Unidade Curricular", "Turno", "Turma", "Inscritos no turno",
                    "Dia da semana", "Hora início da aula", "Hora fim da aula", "Data da aula",
                    "Características da sala pedida para a aula", "Sala atribuída à aula" };
            if (file.getName().toLowerCase().endsWith(".csv")) {
                if (columns.length == expected.length) {
                    boolean structureCorrect = true;
                    for (int i = 0; i < columns.length; i++) {
                        String normalizedString1 = Normalizer.normalize(columns[i].toLowerCase(), Normalizer.Form.NFD)
                                .replaceAll("[^\\p{ASCII}]", "");
                        String normalizedString2 = Normalizer.normalize(expected[i].toLowerCase(), Normalizer.Form.NFD)
                                .replaceAll("[^\\p{ASCII}]", "");
                        if (!normalizedString1.equals(normalizedString2)) {
                            structureCorrect = false;
                            break;
                        }
                    }
                    if (structureCorrect) {
                        JOptionPane.showMessageDialog(panel, "Horário Carregado!", "Sucesso",
                                JOptionPane.PLAIN_MESSAGE);
                        uploaded = true;
                        processAulas(file);
                    } else {
                        JOptionPane.showMessageDialog(panel, "A Estrutura do Horário Está Errada.", "Erro",
                                JOptionPane.ERROR_MESSAGE);
                    }
                } else {
                    JOptionPane.showMessageDialog(panel, "A Estrutura do Horário Está Errada.", "Erro",
                            JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(panel, "O arquivo selecionado não é um arquivo CSV.", "Erro",
                        JOptionPane.ERROR_MESSAGE);
            }
        } catch (IOException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(panel, "Erro ao ler o arquivo.", "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    public void processAulas(File file) throws IOException {
        List<Aula> aulas = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split("[;,]");
                if (data.length == 11) { // Verificar se a linha possui o número correto de campos
                    Aula aula = new Aula(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7],
                            data[8], data[9], data[10]);
                    aulas.add(aula);
                }
            }
            serializeAulas(aulas);
        }
    }

    private void serializeAulas(List<Aula> aulas) {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String jsonAulas = gson.toJson(aulas);
        writeJsonToFile(jsonAulas, "Aulas.json");
    }

    private void writeJsonToFile(String json, String fileName) {
        try (FileWriter writer = new FileWriter(fileName)) {
            writer.write(json);
            JOptionPane.showMessageDialog(panel, "Aulas gravadas em " + fileName, "Sucesso", JOptionPane.PLAIN_MESSAGE);
        } catch (IOException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(panel, "Erro ao gravar o arquivo " + fileName, "Erro",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    private void openWebPage(String url) {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            try {
                Desktop.getDesktop().browse(new URI(url));
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(panel, "Erro ao abrir o navegador.", "Erro", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
