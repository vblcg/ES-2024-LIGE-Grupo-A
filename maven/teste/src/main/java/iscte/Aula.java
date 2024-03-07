package iscte;

import java.sql.Time;
import java.util.Date;

public class Aula {

    public String curso;
    public String uc;
    public String turno;
    public String turma;
    public String Inscritos_no_turno;
    public String dia_da_semana;
    public String hora_inicio_aula;
    public String hora_fim_aula;
    public String data_da_aula;
    public String caracteristicas_da_sala_pedida_para_a_aula;
    public String sala_atribuida_a_aula;

    public Aula(String curso, String uc, String turno, String turma, String Inscritos_no_turno,
    String dia_da_semana, String hora_inicio_aula, String hora_fim_aula,
    String data_da_aula, String caracteristicas_da_sala_pedida_para_a_aula,
    String sala_atribuida_a_aula) {
        this.curso = curso;
        this.uc = uc;
        this.turno = turno;
        this.turma = turma;
        this.Inscritos_no_turno = Inscritos_no_turno;
        this.dia_da_semana = dia_da_semana;
        this.hora_inicio_aula = hora_inicio_aula;
        this.hora_fim_aula = hora_fim_aula;
        this.data_da_aula = data_da_aula;
        this.caracteristicas_da_sala_pedida_para_a_aula = caracteristicas_da_sala_pedida_para_a_aula;
        this.sala_atribuida_a_aula = sala_atribuida_a_aula;
    }
    
}
