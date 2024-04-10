package iscte;

import java.util.Objects;

public class Aula {

    private String curso;
    private String unidadeCurricular;
    private String turno;
    private String turma;
    private String inscritosNoTurno;
    private String diaSemana;
    private String horaInicioAula;
    private String horaFimAula;
    private String dataAula;
    private String caracteristicasSala;
    private String salaAtribuida;

    public Aula(String curso, String unidadeCurricular, String turno, String turma, String inscritosNoTurno,
            String diaSemana, String horaInicioAula, String horaFimAula, String dataAula,
            String caracteristicasSala, String salaAtribuida) {
        this.curso = curso;
        this.unidadeCurricular = unidadeCurricular;
        this.turno = turno;
        this.turma = turma;
        this.inscritosNoTurno = inscritosNoTurno;
        this.diaSemana = diaSemana;
        this.horaInicioAula = horaInicioAula;
        this.horaFimAula = horaFimAula;
        this.dataAula = dataAula;
        this.caracteristicasSala = caracteristicasSala;
        this.salaAtribuida = salaAtribuida;
    }

    // Getters e Setters

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getUnidadeCurricular() {
        return unidadeCurricular;
    }

    public void setUnidadeCurricular(String unidadeCurricular) {
        this.unidadeCurricular = unidadeCurricular;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getTurma() {
        return turma;
    }

    public void setTurma(String turma) {
        this.turma = turma;
    }

    public String getInscritosNoTurno() {
        return inscritosNoTurno;
    }

    public void setInscritosNoTurno(String inscritosNoTurno) {
        this.inscritosNoTurno = inscritosNoTurno;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getHoraInicioAula() {
        return horaInicioAula;
    }

    public void setHoraInicioAula(String horaInicioAula) {
        this.horaInicioAula = horaInicioAula;
    }

    public String getHoraFimAula() {
        return horaFimAula;
    }

    public void setHoraFimAula(String horaFimAula) {
        this.horaFimAula = horaFimAula;
    }

    public String getDataAula() {
        return dataAula;
    }

    public void setDataAula(String dataAula) {
        this.dataAula = dataAula;
    }

    public String getCaracteristicasSala() {
        return caracteristicasSala;
    }

    public void setCaracteristicasSala(String caracteristicasSala) {
        this.caracteristicasSala = caracteristicasSala;
    }

    public String getSalaAtribuida() {
        return salaAtribuida;
    }

    public void setSalaAtribuida(String salaAtribuida) {
        this.salaAtribuida = salaAtribuida;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Aula aula = (Aula) o;
        return Objects.equals(curso, aula.curso) &&
                Objects.equals(unidadeCurricular, aula.unidadeCurricular) &&
                Objects.equals(turno, aula.turno) &&
                Objects.equals(turma, aula.turma) &&
                Objects.equals(inscritosNoTurno, aula.inscritosNoTurno) &&
                Objects.equals(diaSemana, aula.diaSemana) &&
                Objects.equals(horaInicioAula, aula.horaInicioAula) &&
                Objects.equals(horaFimAula, aula.horaFimAula) &&
                Objects.equals(dataAula, aula.dataAula) &&
                Objects.equals(caracteristicasSala, aula.caracteristicasSala) &&
                Objects.equals(salaAtribuida, aula.salaAtribuida);
    }

    @Override
    public int hashCode() {
        return Objects.hash(curso, unidadeCurricular, turno, turma, inscritosNoTurno, diaSemana, horaInicioAula,
                horaFimAula, dataAula, caracteristicasSala, salaAtribuida);
    }

    @Override
    public String toString() {
        return "Aula{" +
                "curso='" + curso + '\'' +
                ", unidadeCurricular='" + unidadeCurricular + '\'' +
                ", turno='" + turno + '\'' +
                ", turma='" + turma + '\'' +
                ", inscritosNoTurno='" + inscritosNoTurno + '\'' +
                ", diaSemana='" + diaSemana + '\'' +
                ", horaInicioAula='" + horaInicioAula + '\'' +
                ", horaFimAula='" + horaFimAula + '\'' +
                ", dataAula='" + dataAula + '\'' +
                ", caracteristicasSala='" + caracteristicasSala + '\'' +
                ", salaAtribuida='" + salaAtribuida + '\'' +
                '}';
    }
}
