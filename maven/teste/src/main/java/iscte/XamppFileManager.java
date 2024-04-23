package iscte;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

/**
 * Esta classe serve para implementar a gravacao de ficheiros para a 'root' do XAMPP,
 * de modo que possam ser acedidos e modificados pelo html.
 *
 * @version 1.0
 */
public class XamppFileManager {


    public static void saveToFileRoot(File file) {
        String xamppRootPath = "C:\\xampp\\htdocs";
        try {
            Path targetPath = Paths.get(xamppRootPath, file.getName());
            if (Files.exists(targetPath)) {
                Files.delete(targetPath);
            }
            Files.copy(file.toPath(), targetPath);
        } catch (IOException e) {
            System.err.println("Erro ao salvar o arquivo na raiz do XAMPP: " + e.getMessage());
        }
    }

    /**
     * Dado um ficheiro 'file', verifica se este existe na 'root' do XAMPP.
     * No caso de existir, apaga-o.
     * Copia o ficheiro para o diretório indicado.
     *  
     * @param file
     */
    public static void saveAllApp() {
        ArrayList<File> files = new ArrayList<>();
        files.add(new File("ficheiros/Salas/SalasDeAulaPorTiposDeSala.html"));
        files.add(new File("ficheiros/Salas/SalasDeAulaPorTiposDeSala.html"));
        files.add(new File("ficheiros/AgendamentoUC/estilos.css"));
        files.add(new File("ficheiros/HorárioSlots/Horário.html"));
        files.add(new File("ficheiros/Salas/CaracterizacaoDasSalas.json"));
        files.add(new File("ficheiros/AgendamentoUC/AgendamentoDeAulas.html"));
        files.add(new File("ficheiros/AgendamentoUC/form.js"));
        files.add(new File("ficheiros/AgendamentoUC/SlotsDisponiveis.html"));
        files.add(new File("ficheiros/AgendamentoUC/visualizacaoSlots.js"));
        files.add(new File("ficheiros/AgendamentoUC/AlteracaoSlots.html"));
        files.add(new File("ficheiros/AgendamentoUC/selecionarAlteracao.js"));
        files.add(new File("ficheiros/HorárioSlots/horario.js"));
        files.add(new File("ficheiros/HorárioSlots/HorárioStyleSheet.css"));
        files.add(new File("ficheiros/Salas/SalaDeAulaPorTiposDeSala.js"));
        files.add(new File("ficheiros/MudarAula/slotsASelecionar.js"));
        files.add(new File("ficheiros/MudarAula/slotsASelecionar.html"));
        String xamppRootPath = "C:\\xampp\\htdocs";
        for (File file : files) { 
            try {
                Path targetPath = Paths.get(xamppRootPath, file.getName());
                if (Files.exists(targetPath)) {
                    Files.delete(targetPath);
                }
                Files.copy(file.toPath(), targetPath);
            } catch (IOException e) {
                System.err.println("Erro ao salvar o arquivo na raiz do XAMPP: " + e.getMessage());
            }
        }
    }
}
