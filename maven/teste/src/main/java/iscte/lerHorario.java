package iscte;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class lerHorario {
    private DefaultTableModel tableModel;

    static String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana", "Hora Início da Aula", "Hora Fim da Aula", "Data da aula", "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};

    public static String[] getStringArray() {
        return colunas;
    }

    public static void main(String[] args) {

    }


    
}
