package iscte;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URISyntaxException;
import javax.swing.JButton;
import javax.swing.JFrame;
import javafx.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.AbstractButton;

public class OpenHTML{
    public static void main(String[] args) {  

		JFrame frame = new JFrame("A Minha Aplicação");  
	    JButton button = new JButton("Mostrar Salas no Browser Web");  
	    button.setBounds(20,20,250,50);  
	    
	    button.addActionListener(new ActionListener(){  	
			public void actionPerformed(ActionEvent e){  
				Desktop desk = Desktop.getDesktop(); 
				try {
					desk.browse(new java.net.URI("file://" + System.getProperty("user.dir") + "/" + "SalasDeAulaPorTiposDeSala.html"));
				} catch (IOException | URISyntaxException e1) {
                    e1.printStackTrace();
                } 
			}

            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                // TODO Auto-generated method stub
                throw new UnsupportedOperationException("Unimplemented method 'actionPerformed'");
            }  
	    });
	    
	    frame.add(button);
	    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	    frame.setSize(400,400);  
	    frame.setLayout(null);  
	    frame.setVisible(true);   

	    System.out.println("Working Directory = " + System.getProperty("user.dir"));
	}  
}