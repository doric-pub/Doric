package pub.doric.dev;

import com.google.gson.JsonObject;

import pub.doric.utils.DoricUtils;

public class DevKit implements IDevKit {

    static boolean isRunningInEmulator = false;
    public static String ip = "";

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
        wsClient.send(DoricUtils.gson.toJson(result));
    }

    @Override
    public void disconnectDevKit() {
        wsClient.close();
        wsClient = null;
    }
}
