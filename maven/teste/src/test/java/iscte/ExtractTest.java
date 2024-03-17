package iscte;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;

import org.apache.commons.compress.harmony.pack200.Segment.PassException;
import org.junit.Test;

public class ExtractTest {

    @Test
    public void testExtractConstructor() {
        String inputFile = "HorarioDeExemplo.csv";
        String outputFile = "output.json";
        
        Extract extract = new Extract(inputFile, outputFile);

        assertEquals(inputFile, extract.getInputFile());
        assertEquals(outputFile, extract.getOutputFile());
    }

    @Test
    public void testGetSemanaAno() throws ParseException {
        // Datas de teste
        String[] dates = {"01/01/2024", "15/06/2025", "31/12/2022"};

        // Semanas esparadas para as datas de teste
        int[] expectedWeekNumbers = {1, 24, 52};

        for (int i = 0; i < dates.length; i++) {
            int actualWeekNumber = Extract.getSemanaAno(dates[i]);
            assertEquals(expectedWeekNumbers[i], actualWeekNumber);
        }
    }
   
    @Test
    public void testGetSemanaSemestre() throws ParseException{
        // Datas de teste
       
        String[] dates = {"09/09/2022", "09/12/2022", "15/03/2023"};

        // Semanas esparadas para as datas de teste
        long[] expectedWeekNumbers = { 1, 14, 27 };

        for (int i = 0; i < dates.length; i++) {
            long actualWeekNumber = Extract.getSemanaSemestre(dates[i]);
            if (actualWeekNumber==expectedWeekNumbers[i])
                System.out.println("correto");
        }

    }

    @Test
    public void testReadCsvUsingBufferReader() {
        String inputFile = "C:\\Users\\nunol\\OneDrive\\Documentos\\Github\\ES\\ES-2024-LIGE-Grupo-A\\HorarioDeExemplo.csv";
        
        File outputFile;
        try {
            outputFile = File.createTempFile("output", ".json");
        } catch (IOException e) {
            throw new RuntimeException("Failed to create temporary file", e);
        }

        Extract testExtractor = new Extract(inputFile, outputFile.getAbsolutePath());
        testExtractor.readCsvUsingBufferReader();

        //Verifica se o fihcheiro foi criado corretamente
        assertTrue(outputFile.exists());
        //Verifica se foi escrita alguma coisa no ficheiro
        assertTrue(outputFile.length() > 0);
        
        outputFile.delete();
    }
}
