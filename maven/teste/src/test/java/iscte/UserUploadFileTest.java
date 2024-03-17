package iscte;

import static org.junit.Assert.assertEquals;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.junit.Test;

public class UserUploadFileTest {
    
    /*
    @Test
    public void testUserUploadFileConstructor() {
        File[] fileHolder = new File[1]; 
        String jsonFile = "teste.json";

        UserUploadFile userUploadFile = new UserUploadFile(fileHolder, jsonFile);

        assertEquals(fileHolder, userUploadFile.getFileholder()[0]);
    }
    */

    @Test
    public void testDownloadFileFromGitHub() {
        String githubFileUrl = "https://raw.githubusercontent.com/vblcg/ES-2024-LIGE-Grupo-A/main/ficheiros/HorarioDeExemplo.csv";
        String fileName = githubFileUrl.substring(githubFileUrl.lastIndexOf('/') + 1);
        String destinationFilePath = "maven/teste/src/test/java/iscte" + fileName;
        File downloadedFile = new File(destinationFilePath);

        UserUploadFile userUploadFile = new UserUploadFile(new File[1], "ficheiros/Horário.json");
        userUploadFile.downloadFileFromGitHub(githubFileUrl);

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

        File file = userUploadFile.getFileholder()[0];

        assertEquals(downloadedFile, file);
    }


    @Test
    public void testCheckCsvStructure () throws IOException {
        UserUploadFile userUploadFile = new UserUploadFile(new File[1], "test.json");

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


        userUploadFile.checkCsvStructure(downloadedFile);


        assertEquals(userUploadFile.getFileholder()[0], downloadedFile);
    }
    
    
}

