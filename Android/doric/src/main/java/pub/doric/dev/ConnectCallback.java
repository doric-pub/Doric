package pub.doric.dev;

public interface ConnectCallback {
    void connected();

    void exception(Exception exception);
}
