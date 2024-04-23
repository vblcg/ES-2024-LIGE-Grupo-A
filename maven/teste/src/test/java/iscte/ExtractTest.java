package iscte;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.text.ParseException;


import org.junit.Test;

public class ExtractTest {

    @Test
    public void testExtractConstructor() {
        String inputFile = "ficheiro\\HorarioDeExemplo.csv";
        String outputFile = "ficheiros\\Horário.json";

        File[] file = new File[1];
        file[0] = new File(inputFile);
        
        extract extract = new extract(file, outputFile);

        assertEquals(inputFile, extract.getInputFile());
        assertEquals(outputFile, extract.getOutputFile());
    }

    @Test
    public void testGetSemanaAno() throws ParseException {
        String inputFile = "ficheiro\\HorarioDeExemplo.csv";
        String outputFile = "ficheiros\\Horário.json";

        File[] file = new File[1];
        file[0] = new File(inputFile);
        
        extract extract = new extract(file, outputFile);

        // Datas de teste
        String[] dates = {"01/01/2024", "15/06/2025", "31/12/2022"};

        // Semanas esparadas para as datas de teste
        int[] expectedWeekNumbers = {1, 24, 52};

        for (int i = 0; i < dates.length; i++) {
            int actualWeekNumber = extract.getSemanaAno(dates[i]);
            assertEquals(expectedWeekNumbers[i], actualWeekNumber);
        }
    }
   
    @Test
    public void testGetSemanaSemestre() throws ParseException{
        String inputFile = "ficheiro\\HorarioDeExemplo.csv";
        String outputFile = "ficheiros\\Horário.json";

        File[] file = new File[1];
        file[0] = new File(inputFile);
        
        extract extract = new extract(file, outputFile);
        // Datas de teste
       
        String[] dates = {"09/09/2022", "09/12/2022", "15/03/2023"};
        // Semanas esparadas para as datas de teste
        long[] expectedWeekNumbers = {1, 14, 6};

        for (int i = 0; i < dates.length; i++){
            long actualWeekNumber = extract.getSemanaSemestre(dates[i]);
            assertEquals(expectedWeekNumbers[i], actualWeekNumber);
        }

    }

    @Test
    public void testReadCsvUsingBufferReader() {
        String inputFile = "ficheiros\\HorarioDeExemplo.csv";
        String outputFileS = "ficheiros\\Horário.json";
        String directoryPath = "ficheiros";

        File[] file = new File[1];
        file[0] = new File(inputFile);
        

        extract testExtractor = new extract(file, outputFileS);
        testExtractor.readCsvUsingBufferReader();

        File directory = new File(directoryPath);
        if (directory.exists() && directory.isDirectory()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file1 : files) {
                    if (file1.getName().equals("outputFileS")) {
                        assertTrue(file1.length() > 1);
                    }
                }
            }
        }
    }

}