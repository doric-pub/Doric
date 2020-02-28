package pub.doric.devkit.remote;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONArray;
import org.json.JSONException;
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
import pub.doric.devkit.DevKit;
import pub.doric.devkit.IStatusCallback;
import pub.doric.devkit.event.StopDebugEvent;

public class RemoteJSExecutor {
    private final WebSocket webSocket;
    private final Map<String, JavaFunction> globalFunctions = new HashMap<>();
    private JSDecoder temp;

    public RemoteJSExecutor(final IStatusCallback statusCallback) {
        OkHttpClient okHttpClient = new OkHttpClient
                .Builder()
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();
        final Request request = new Request.Builder().url("ws://" + DevKit.ip + ":2080").build();

        final Thread current = Thread.currentThread();
        webSocket = okHttpClient.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                LockSupport.unpark(current);
                statusCallback.start();
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                if (t instanceof ConnectException) {
                    // 连接remote异常
                    LockSupport.unpark(current);
                    throw new RuntimeException("remote js executor cannot connect");
                } else if (t instanceof EOFException) {
                    // 被远端强制断开
                    System.out.println("remote js executor eof");

                    LockSupport.unpark(current);
                    EventBus.getDefault().post(new StopDebugEvent());
                }
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                try {
                    JSONObject jsonObject = new JSONObject(text);
                    String cmd = jsonObject.optString("cmd");
                    switch (cmd) {
                        case "injectGlobalJSFunction": {
                            String name = jsonObject.optString("name");
                            JSONArray arguments = jsonObject.optJSONArray("arguments");
                            assert arguments != null;
                            JSDecoder[] decoders = new JSDecoder[arguments.length()];
                            for (int i = 0; i < arguments.length(); i++) {
                                Object o = arguments.get(i);
                                decoders[i] = new JSDecoder(new ValueBuilder(o).build());
                            }
                            globalFunctions.get(name).exec(decoders);
                        }

                        break;
                        case "invokeMethod": {
                            try {
                                Object result = jsonObject.opt("result");
                                ValueBuilder vb = new ValueBuilder(result);
                                temp = new JSDecoder(vb.build());
                                System.out.println(result);
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            } finally {
                                LockSupport.unpark(current);
                            }
                        }
                        break;
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
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
        webSocket.send(new JSONBuilder().put("cmd", "injectGlobalJSFunction")
                .put("name", name).toString()
        );
    }

    public void injectGlobalJSObject(String name, JavaValue javaValue) {
        webSocket.send(new JSONBuilder().put("cmd", "injectGlobalJSObject")
                .put("name", name)
                .put("type", javaValue.getType())
                .put("value", javaValue.getValue()).toString()
        );
    }

    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) {
        JSONArray jsonArray = new JSONArray();
        for (JavaValue javaValue : javaValues) {
            jsonArray.put(new JSONBuilder()
                    .put("type", javaValue.getType())
                    .put("value", javaValue.getValue())
                    .toJSONObject());
        }
        webSocket.send(new JSONBuilder()
                .put("cmd", "invokeMethod")
                .put("objectName", objectName)
                .put("functionName", functionName)
                .put("values", jsonArray)
                .put("hashKey", hashKey)
                .toString());

        LockSupport.park(Thread.currentThread());
        return temp;
    }

    public void destroy() {
        webSocket.close(1000, "destroy");
    }
}
