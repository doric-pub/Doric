package pub.doric.dev;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

/**
 * @Description: com.github.penfeizhou.doric.dev
 * @Author: pengfei.zhou
 * @CreateDate: 2019-08-03
 */
public class WSClient extends WebSocketListener {
    private final WebSocket webSocket;

    public WSClient(String url) {
        OkHttpClient okHttpClient = new OkHttpClient
                .Builder()
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();
        Request request = new Request.Builder().url(url).build();
        webSocket = okHttpClient.newWebSocket(request, this);
    }

    public void close() {
        webSocket.close(-1, "Close");
    }

    @Override
    public void onOpen(WebSocket webSocket, Response response) {
        super.onOpen(webSocket, response);
    }

    @Override
    public void onMessage(WebSocket webSocket, String text) {
        super.onMessage(webSocket, text);
        try {
            JSONObject jsonObject = new JSONObject(text);
            String source = jsonObject.optString("source");
            String script = jsonObject.optString("script");
            for (DoricContext context : DoricContextManager.aliveContexts()) {
                if (source.contains(context.getSource())) {
                    context.reload(script);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onClosing(WebSocket webSocket, int code, String reason) {
        super.onClosing(webSocket, code, reason);
    }

    @Override
    public void onClosed(WebSocket webSocket, int code, String reason) {
        super.onClosed(webSocket, code, reason);
    }

    @Override
    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
        super.onFailure(webSocket, t, response);
    }
}
