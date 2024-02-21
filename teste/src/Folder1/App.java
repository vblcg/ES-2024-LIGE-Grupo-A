package Folder1;
public class App {
    public static int increment(int number) {
        for (int ii = 0; ii < 1000; ii++) {
            number++;
            System.out.println(number);
        }
        return number;
    }
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        App.increment(0);
    }
}
