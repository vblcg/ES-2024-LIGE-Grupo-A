package iscte;

//import static spark.Spark.*;

import java.io.FileWriter;
import java.io.IOException;

public class Server {

    private static final String AULAS_JSON_PATH = "Aulas.json";

    public static void startServer() {
        // Configurar rota para lidar com o envio do formulário
        post("/submitAula", (req, res) -> {
            try {
                // Extrair os parâmetros do formulário
                String nomeUC = req.queryParams("UC");
                String nomeLicenciatura = req.queryParams("Licenciatura");
                int numeroAulas = Integer.parseInt(req.queryParams("nmrAulas"));
                int numeroAlunos = Integer.parseInt(req.queryParams("nmrAlunos"));
                int semanaSemestre = Integer.parseInt(req.queryParams("semanaSemestre"));

                // Criar um objeto JSON com os dados da aula submetida
                String jsonAula = "{\"UC\": \"" + nomeUC + "\", " +
                        "\"Licenciatura\": \"" + nomeLicenciatura + "\", " +
                        "\"NumeroAulas\": " + numeroAulas + ", " +
                        "\"NumeroAlunos\": " + numeroAlunos + ", " +
                        "\"SemanaSemestre\": " + semanaSemestre + "}";

                // Adicionar a aula ao arquivo JSON
                appendToJsonFile(jsonAula);

                // Redirecionar para a página com as aulas submetidas
                res.redirect("/aulasSubmetidas.html");
                return "Aula submetida com sucesso!";
            } catch (NumberFormatException e) {
                res.status(400); // Bad request se houver erro de formatação
                return "Erro ao processar os dados do formulário.";
            }
        });
    }

    private static void appendToJsonFile(String jsonAula) {
        try (FileWriter fileWriter = new FileWriter(AULAS_JSON_PATH, true)) {
            fileWriter.write(jsonAula + "\n");
        } catch (IOException e) {
            System.err.println("Erro ao escrever no arquivo JSON: " + e.getMessage());
        }
    }
}
