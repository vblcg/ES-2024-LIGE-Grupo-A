package iscte;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;


import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class lerHorario {

    static String csvFile = "maven/teste/HorarioDeExemplo.csv";

    static String[] colunas = {"Curso", "UC", "Turno", "Turma", "Inscritos no Turno", "Dia da Semana", "Hora Início da Aula", "Hora Fim da Aula", "Data da aula", "Caracteristicas da sala pedida para a aula", "Sala atribuida a aula"};


    public static void main(String[] args) throws FileNotFoundException, IOException, CsvValidationException {
        try (CSVReader csvReader = new CSVReaderBuilder(new FileReader(csvFile)).withSkipLines(1).build()) {

            //teste para verificar a leitura correta do ficheir csv
            String[] nextRecord;
            while ((nextRecord = csvReader.readNext()) != null) {
                System.out.println("Row: " + String.join(", ", nextRecord));
            }

    }
}


    
}
