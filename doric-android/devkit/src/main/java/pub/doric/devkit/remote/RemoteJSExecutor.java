package pub.doric.devkit.remote;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.LockSupport;

import pub.doric.devkit.WSClient;

public class RemoteJSExecutor implements WSClient.Interceptor {
    private final Map<String, JavaFunction> globalFunctions = new HashMap<>();
    private final WSClient wsClient;
    private final Thread currentThread;

    private final AtomicInteger callIdCounter = new AtomicInteger();

    private Map<Integer, Thread> mThreads = new HashMap<>();
    private Map<Integer, JSDecoder> mResults = new HashMap<>();

    public volatile boolean invokingMethod = false;

    public RemoteJSExecutor(WSClient wsClient) {
        this.wsClient = wsClient;
        this.wsClient.addInterceptor(this);
        currentThread = Thread.currentThread();
    }

    public String loadJS(String script, String source) {
        return null;
    }

    public JSDecoder evaluateJS(String script, String source, boolean hashKey) {
        return null;
    }

    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {
        globalFunctions.put(name, javaFunction);
        wsClient.sendToDebugger(
                "injectGlobalJSFunction",
                new JSONBuilder()
                        .put("cmd", "injectGlobalJSFunction")
                        .put("name", name)
                        .toJSONObject());
    }

    public void injectGlobalJSObject(String name, JavaValue javaValue) {
        wsClient.sendToDebugger(
                "injectGlobalJSObject",
                new JSONBuilder()
                        .put("name", name)
                        .put("type", javaValue.getType())
                        .put("value", javaValue.getValue())
                        .toJSONObject());
    }

    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) {
        JSONArray jsonArray = new JSONArray();
        for (JavaValue javaValue : javaValues) {
            jsonArray.put(new JSONBuilder()
                    .put("type", javaValue.getType())
                    .put("value", javaValue.getValue())
                    .toJSONObject());
        }
        int callId = callIdCounter.incrementAndGet();
        wsClient.sendToDebugger(
                "invokeMethod",
                new JSONBuilder()
                        .put("cmd", "invokeMethod")
                        .put("objectName", objectName)
                        .put("functionName", functionName)
                        .put("values", jsonArray)
                        .put("callId", callId)
                        .put("hashKey", hashKey)
                        .toJSONObject());
        invokingMethod = true;
        Thread thread = Thread.currentThread();
        mThreads.put(callId, thread);
        LockSupport.park(thread);
        invokingMethod = false;
        return mResults.remove(callId);
    }

    public void destroy() {
        wsClient.sendToDebugger("DEBUG_STOP", null);
        wsClient.removeInterceptor(this);
    }

    @Override
    public boolean intercept(String type, String cmd, JSONObject payload) throws JSONException {
        if ("D2C".equals(type)) {
            switch (cmd) {
                case "injectGlobalJSFunction": {
                    String name = payload.optString("name");
                    JSONArray arguments = payload.optJSONArray("arguments");
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
                    int callId = payload.optInt("callId");
                    try {
                        Object result = payload.opt("result");
                        ValueBuilder vb = new ValueBuilder(result);
                        mResults.put(callId, new JSDecoder(vb.build()));
                        System.out.println(result);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    } finally {
                        LockSupport.unpark(mThreads.remove(callId));
                    }
                }
                break;
                default:
                    break;
            }
            return true;
        }

        return false;
    }
}
