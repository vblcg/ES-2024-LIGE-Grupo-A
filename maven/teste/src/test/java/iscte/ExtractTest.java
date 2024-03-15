package iscte;

import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.Test;

public class ExtractTest {
   
    @Test
    public void testReadCsvUsingBufferReader() {
        String inputFile = "HorarioDeExemplo.csv";
        String outputFile = "testoutput.json";

        File csvFile = new File(inputFile);
        assertTrue(csvFile.exists());

        Extract test_extractor = new Extract(inputFile, outputFile);
        test_extractor.readCsvUsingBufferReader();

        File finalOutputFile = new File(outputFile);
        assertTrue(finalOutputFile.exists());

    }
}
