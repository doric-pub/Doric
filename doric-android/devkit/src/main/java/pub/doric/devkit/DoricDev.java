package pub.doric.devkit;

import com.google.gson.JsonObject;

public class DoricDev {
    public static void connectDevKit(String url) {
        DevKit.getInstance().connectDevKit(url);
    }

    public static void sendDevCommand(IDevKit.Command command, JsonObject jsonObject) {
        DevKit.getInstance().sendDevCommand(command, jsonObject);
    }

    public static void disconnectDevKit() {
        DevKit.getInstance().disconnectDevKit();
    }
}
