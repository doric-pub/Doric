package pub.doric.engine.remote;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import org.jetbrains.annotations.NotNull;

import java.io.EOFException;
import java.net.ConnectException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.LockSupport;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class RemoteJSExecutor {

    private final WebSocket webSocket;
    private final Gson gson = new Gson();

    private final Map<String, JavaFunction> globalFunctions = new HashMap<>();

    public RemoteJSExecutor() {
        OkHttpClient okHttpClient = new OkHttpClient
                .Builder()
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();
        Request request = new Request.Builder().url("ws://192.168.24.166:2080").build();

        final Thread current = Thread.currentThread();
        webSocket = okHttpClient.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                LockSupport.unpark(current);
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                if (t instanceof ConnectException) {
                    // 连接remote异常
                    LockSupport.unpark(current);
                    throw new RuntimeException("remote js executor cannot connect");
                } else if (t instanceof EOFException) {
                    // 被远端强制断开
                    throw new RuntimeException("remote js executor eof");
                }
            }

            @Override
            public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
                JsonElement je = gson.fromJson(text, JsonElement.class);

                if (je instanceof JsonObject) {
                    JsonObject jo = ((JsonObject) je);
                    String cmd = jo.get("cmd").getAsString();
                    switch (cmd) {
                        case "injectGlobalJSFunction":
                            String name = jo.get("name").getAsString();
                            JsonObject arguments = jo.getAsJsonObject("arguments");
                            for (String key : arguments.keySet()) {
                                System.out.println(key + " " + arguments.get(key));
                            }
                            break;
                    }
                }
            }
        });
        LockSupport.park(current);
    }

    public String loadJS(String script, String source) {
        return null;
    }

    public JSDecoder evaluateJS(String script, String source, boolean hashKey) {
        return null;
    }

    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {
        globalFunctions.put(name, javaFunction);

        JsonObject jo = new JsonObject();
        jo.addProperty("cmd", "injectGlobalJSFunction");
        jo.addProperty("name", name);
        webSocket.send(gson.toJson(jo));
    }

    public void injectGlobalJSObject(String name, JavaValue javaValue) {
    }

    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) {
        return null;
    }

    public void destroy() {
        webSocket.close(0, "destroy");
    }
}
