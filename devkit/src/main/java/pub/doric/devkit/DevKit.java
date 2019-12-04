package pub.doric.devkit;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class DevKit implements IDevKit {

    public static boolean isRunningInEmulator = false;
    public static String ip = "";
    private static Gson gson = new Gson();

    private static class Inner {
        private static final DevKit sInstance = new DevKit();
    }

    private DevKit() {
    }

    public static DevKit getInstance() {
        return Inner.sInstance;
    }


    private WSClient wsClient;

    @Override
    public void connectDevKit(String url) {
        wsClient = new WSClient(url);
    }

    @Override
    public void sendDevCommand(IDevKit.Command command, JsonObject jsonObject) {
        JsonObject result = new JsonObject();
        result.addProperty("cmd", command.toString());
        result.add("data", jsonObject);
        wsClient.send(gson.toJson(result));
    }

    @Override
    public void disconnectDevKit() {
        wsClient.close();
        wsClient = null;
    }
}
