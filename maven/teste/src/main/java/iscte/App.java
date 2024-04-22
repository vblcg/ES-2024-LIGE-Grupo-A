package iscte;

import java.io.File;

/**
 * Classe onde a APP deve ser corrida.
 * Começa por guardar as versões mais recentes dos ficheiros html.
 * Depois, instancia o 'upload' de um ficheiro, atraves da interface grafica.
 */
public class App {
    
    /** 
     * @param args
     */
    public static void main(String[] args) {
        File[] fileHolder = new File[1]; 
        String jsonFile = "ficheiros/Horário.json";
        UserUploadFile uploadFile = new UserUploadFile(fileHolder, jsonFile); 
        XamppFileManager.saveToFileRoot(new File("ficheiros/Salas/SalasDeAulaPorTiposDeSala.html"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/estilos.css"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/HorárioSlots/Horário.html"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/Salas/CaracterizacaoDasSalas.json"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/AgendamentoDeAulas.html"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/form.js"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/SlotsDisponiveis.html"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/visualizacaoSlots.js"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/AlteracaoSlots.html"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/AgendamentoUC/selecionarAlteracao.js"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/HorárioSlots/horario.js"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/HorárioSlots/HorárioStyleSheet.css"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/Salas/SalaDeAulaPorTiposDeSala.js"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/MudarAula/slotsASelecionar.js"));
        XamppFileManager.saveToFileRoot(new File("ficheiros/MudarAula/slotsASelecionar.html"));

        uploadFile.setVisible(true); 
    }
}