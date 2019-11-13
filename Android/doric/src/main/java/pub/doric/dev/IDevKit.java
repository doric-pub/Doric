package pub.doric.dev;

import com.google.gson.JsonObject;

import pub.doric.IDoricDriver;

public interface IDevKit {

    enum Command {
        DEBUG, HOT_RELOAD
    }

    void connectDevKit(String url);

    void sendDevCommand(IDevKit.Command command, JsonObject jsonObject);

    void disconnectDevKit();
}
