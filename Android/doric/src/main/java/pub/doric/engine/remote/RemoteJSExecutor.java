package pub.doric.engine.remote;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;

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
import pub.doric.utils.DoricUtils;

public class RemoteJSExecutor {

    private final WebSocket webSocket;

    private final Map<String, JavaFunction> globalFunctions = new HashMap<>();

    private JSDecoder temp;

    public RemoteJSExecutor() {
        OkHttpClient okHttpClient = new OkHttpClient
                .Builder()
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();
        final Request request = new Request.Builder().url("ws://192.168.25.175:2080").build();

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
                JsonElement je = DoricUtils.gson.fromJson(text, JsonElement.class);

                if (je instanceof JsonObject) {
                    JsonObject jo = ((JsonObject) je);
                    String cmd = jo.get("cmd").getAsString();
                    switch (cmd) {
                        case "injectGlobalJSFunction": {
                            String name = jo.get("name").getAsString();
                            JsonArray arguments = jo.getAsJsonArray("arguments");
                            JSDecoder[] decoders = new JSDecoder[arguments.size()];
                            for (int i = 0; i < arguments.size(); i++) {
                                if (arguments.get(i).isJsonPrimitive()) {
                                    JsonPrimitive jp = ((JsonPrimitive) arguments.get(i));
                                    if (jp.isNumber()) {
                                        ValueBuilder vb = new ValueBuilder(jp.getAsNumber());
                                        JSDecoder decoder = new JSDecoder(vb.build());
                                        decoders[i] = decoder;
                                    } else if (jp.isBoolean()) {
                                        ValueBuilder vb = new ValueBuilder(jp.getAsBoolean());
                                        JSDecoder decoder = new JSDecoder(vb.build());
                                        decoders[i] = decoder;
                                    } else if (jp.isString()) {
                                        ValueBuilder vb = new ValueBuilder(jp.getAsString());
                                        JSDecoder decoder = new JSDecoder(vb.build());
                                        decoders[i] = decoder;
                                    }
                                } else {
                                    try {
                                        ValueBuilder vb = new ValueBuilder(new JSONObject(DoricUtils.gson.toJson(arguments.get(i))));
                                        JSDecoder decoder = new JSDecoder(vb.build());
                                        decoders[i] = decoder;
                                    } catch (Exception ex) {
                                        ex.printStackTrace();
                                    }

                                }
                            }


                            globalFunctions.get(name).exec(decoders);
                        }

                        break;
                        case "invokeMethod": {
                            try {
                                Object result = jo.get("result");
                                ValueBuilder vb = new ValueBuilder(result);
                                JSDecoder decoder = new JSDecoder(vb.build());
                                temp = decoder;
                                System.out.println(result);
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            } finally {
                                LockSupport.unpark(current);
                            }
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
        webSocket.send(DoricUtils.gson.toJson(jo));
    }

    public void injectGlobalJSObject(String name, JavaValue javaValue) {
    }

    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) {
        JsonObject jo = new JsonObject();
        jo.addProperty("cmd", "invokeMethod");
        jo.addProperty("objectName", objectName);
        jo.addProperty("functionName", functionName);

        JsonArray ja = new JsonArray();
        for (JavaValue javaValue : javaValues) {
            JsonObject argument = new JsonObject();
            argument.addProperty("type", javaValue.getType());
            argument.addProperty("value", javaValue.getValue());
            ja.add(argument);
        }
        jo.add("javaValues", ja);

        jo.addProperty("hashKey", hashKey);
        webSocket.send(DoricUtils.gson.toJson(jo));

        LockSupport.park(Thread.currentThread());
        return temp;
    }

    public void destroy() {
        webSocket.close(0, "destroy");
    }
}
