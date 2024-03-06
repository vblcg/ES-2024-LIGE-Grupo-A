package iscte;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class lerHorario {

    String csvFile = "yourfile.csv";

    static String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana", "Hora Início da Aula", "Hora Fim da Aula", "Data da aula", "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};


    public static void main(String[] args) throws FileNotFoundException, IOException {
         try (CSVReader csvReader = new CSVReaderBuilder(new FileReader("FICHEIRO.csv")).withSkipLines(1).build()) {
            
         }

    }


    
}
