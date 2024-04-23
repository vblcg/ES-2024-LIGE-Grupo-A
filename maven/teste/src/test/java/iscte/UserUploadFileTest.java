package iscte;

import static org.junit.Assert.assertTrue;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.junit.Test;

public class UserUploadFileTest {

    @Test
    public void testDownloadFileFromGitHub() {
        String githubFileUrl = "https://raw.githubusercontent.com/vblcg/ES-2024-LIGE-Grupo-A/main/ficheiros/HorarioDeExemplo.csv";
        String fileName = githubFileUrl.substring(githubFileUrl.lastIndexOf('/') + 1);
        String destinationFilePath = "maven/teste/src/test/java/iscte" + fileName;
        File downloadedFile = new File(destinationFilePath);

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(githubFileUrl).build();
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                
                try (FileOutputStream outputStream = new FileOutputStream(downloadedFile)) {
                    outputStream.write(response.body().bytes());
                } catch (Exception e) {
                    System.out.println("erro aqui");
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Error writing file: " + e.getMessage());
        }


        UserUploadFile userUploadFile = new UserUploadFile(new File[1], "ficheiros/Horário.json");
        userUploadFile.downloadFileFromGitHub(githubFileUrl);
        File file = userUploadFile.getFileholder()[0];

        assertTrue(downloadedFile.length() == file.length());

    }


    @Test
    public void testCheckCsvStructure () throws IOException {
        UserUploadFile userUploadFile = new UserUploadFile(new File[1], "ficheiros/Horário.json");

        String githubFileUrl = "https://raw.githubusercontent.com/vblcg/ES-2024-LIGE-Grupo-A/main/ficheiros/HorarioDeExemplo.csv";
        String fileName = githubFileUrl.substring(githubFileUrl.lastIndexOf('/') + 1);
        String destinationFilePath = "ficheiros/" + fileName;
        File downloadedFile = new File(destinationFilePath);

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(githubFileUrl).build();
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                try (FileOutputStream outputStream = new FileOutputStream(downloadedFile)) {
                    outputStream.write(response.body().bytes());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Error writing file: " + e.getMessage());
        }

        userUploadFile.checkCsvStructure(downloadedFile);

        assertTrue(userUploadFile.getFileholder()[0].length() == downloadedFile.length());
    }
    
    
}

