package pub.doric.devkit;

import com.google.gson.JsonObject;

public interface IDevKit {

    enum Command {
        DEBUG, HOT_RELOAD, EXCEPTION, LOG
    }

    void connectDevKit(String url);

    void sendDevCommand(IDevKit.Command command, JsonObject jsonObject);

    void disconnectDevKit();
}
