package iscte;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Esta classe serve para implementar a gravacao de ficheiros para a 'root' do
 * XAMPP,
 * de modo que possam ser acedidos e modificados pelo html.
 *
 * @version 1.0
 */
public class XamppFileManager {

    /**
     * Dado um ficheiro 'file', verifica se este existe na 'root' do XAMPP.
     * No caso de existir, apaga-o.
     * Copia o ficheiro para o diretório indicado.
     * 
     * @param file
     */
    public static void saveToFileRoot(File file) {
        String xamppRootPath = "C:\\xampp\\htdocs";
        try {
            Path targetPath = Paths.get(xamppRootPath, file.getName());
            if (Files.exists(targetPath)) {
                Files.delete(targetPath);
            }
            Files.copy(file.toPath(), targetPath);

            System.out.println("Arquivo salvo com sucesso na raiz do XAMPP.");
        } catch (IOException e) {
            System.err.println("Erro ao salvar o arquivo na raiz do XAMPP: " + e.getMessage());
        }
    }
}
