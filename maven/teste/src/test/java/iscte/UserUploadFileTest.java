package iscte;

import static org.junit.Assert.assertEquals;
import java.io.File;
import java.io.IOException;

import org.junit.Test;

public class UserUploadFileTest {
    File[] fileHolder = new File[1]; 
    String jsonFile = "output.json";

    @Test
    public void testInvalidUrl() throws IOException {
        String githubFileUrl = "file://example.com/file.csv";
        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);
        assertEquals("URL inválida. Certifique-se de incluir 'http://' ou 'https://'.",
                userUploadFile.checkLinkStructure(githubFileUrl));
    }

    @Test
    public void testInvalidGitHubUrl() throws IOException {
        String githubFileUrl = "https://chat.openai.com/c/df8ab1f4-006f-48b3-ac71-733db9b25291";
        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);
        assertEquals("O ficheiro selecionado não é um arquivo do GitHub.",
                userUploadFile.checkLinkStructure(githubFileUrl));
    }

    @Test
    public void testInvalidFileExtension() throws IOException {
        String githubFileUrl = "https://raw.githubusercontent.com/example/file.jpg";
        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);
        assertEquals("O arquivo selecionado não é um arquivo CSV.",
                userUploadFile.checkLinkStructure(githubFileUrl));
    }

    @Test
    public void testGitSuccess() throws IOException {
        String githubFileUrl = "https://raw.githubusercontent.com/vblcg/ES-2024-LIGE-Grupo-A/main/HorarioDeExemplo.csv";
        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);
        assertEquals("Horário verificado",
            userUploadFile.checkLinkStructure(githubFileUrl));
    }

    @Test
    public void testDownloadFail() {
        String githubFileUrl = "https://raw.githubusercontent.com/example/com/file.csv";
        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);
        assertEquals(null, userUploadFile.downloadFileFromGitHub(githubFileUrl));
    }

    /* 
    @Test
    public void testDownloadSuccess() {
        String githubFileUrl = "https://raw.githubusercontent.com/vblcg/ES-2024-LIGE-Grupo-A/main/HorarioDeExemplo.csv";
        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);
        assertEquals(true, userUploadFile.downloadFileFromGitHub(githubFileUrl));
    }
    */
}
