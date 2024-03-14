package iscte;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class XamppFileManager {
    
    public static void saveToFileRoot(File file) {
        // Caminho para o diretório raiz do XAMPP
        String xamppRootPath = "C:\\xampp\\htdocs";
        
        try {
            // Verifica se o arquivo já existe na raiz do XAMPP
            Path targetPath = Paths.get(xamppRootPath, file.getName());
            if (Files.exists(targetPath)) {
                // Se o arquivo já existe, exclua-o antes de copiar o novo arquivo
                Files.delete(targetPath);
            }
            
            // Copia o arquivo para a raiz do XAMPP
            Files.copy(file.toPath(), targetPath);
            
            System.out.println("Arquivo salvo na raiz do XAMPP com sucesso.");
        } catch (IOException e) {
            System.err.println("Erro ao salvar o arquivo na raiz do XAMPP: " + e.getMessage());
        }
    }
}
