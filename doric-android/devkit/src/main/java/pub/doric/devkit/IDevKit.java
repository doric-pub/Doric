package pub.doric.devkit;


import org.json.JSONObject;

public interface IDevKit {

    enum Command {
        HOT_RELOAD, EXCEPTION, LOG, DEBUG
    }

    void connectDevKit(String url);

    void sendDevCommand(IDevKit.Command command, JSONObject jsonObject);

    void disconnectDevKit();

    void startDebugging(String source);

    void stopDebugging(boolean resume);
}
