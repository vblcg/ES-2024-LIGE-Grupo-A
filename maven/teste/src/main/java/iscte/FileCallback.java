package iscte;

import java.io.File;


/**
 * Interface para implementar o que acontece quando se recebe um ficheiro.
 * 
 */
public interface FileCallback {
        void onFileSelected(File selectedFile);
}
