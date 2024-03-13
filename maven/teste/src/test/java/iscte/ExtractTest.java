package iscte;

import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.Test;

public class ExtractTest {
    @Test
    public void testMain() {

    }

    @Test
    public void testReadCsvUsingBufferReader() {
        File[] holder = {new File("HorarioDeExemplo.csv")};
        String outputFile = "output.json";

        Extract extractInstance = new Extract(holder, outputFile);
        extractInstance.readCsvUsingBufferReader();

        File jsonOutputFile = new File(outputFile);
        System.out.println("Output file path: " + jsonOutputFile.getAbsolutePath());
        
        assertTrue(jsonOutputFile.exists());

        if (jsonOutputFile.exists()) {
            jsonOutputFile.delete();
        }

    }
}
