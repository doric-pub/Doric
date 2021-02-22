/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric.devkit;

import com.github.pengfeizhou.jscore.JSONBuilder;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.EOFException;
import java.net.ConnectException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import pub.doric.DoricContext;
import pub.doric.devkit.event.ConnectExceptionEvent;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.event.OpenEvent;

/**
 * @Description: com.github.penfeizhou.doric.dev
 * @Author: pengfei.zhou
 * @CreateDate: 2019-08-03
 */
public class WSClient extends WebSocketListener {
    private final WebSocket webSocket;

    public interface Interceptor {
        boolean intercept(String type, String command, JSONObject payload) throws JSONException;
    }

    private final Set<Interceptor> interceptors = new HashSet<>();

    public WSClient(String url) {
        OkHttpClient okHttpClient = new OkHttpClient
                .Builder()
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();
        Request request = new Request.Builder().url(url).build();
        webSocket = okHttpClient.newWebSocket(request, this);
    }

    public void addInterceptor(Interceptor interceptor) {
        interceptors.add(interceptor);
    }


    public void removeInterceptor(Interceptor interceptor) {
        interceptors.remove(interceptor);
    }

    public void close() {
        webSocket.close(1000, "Close");
    }

    @Override
    public void onOpen(WebSocket webSocket, Response response) {
        super.onOpen(webSocket, response);

        EventBus.getDefault().post(new OpenEvent());
    }

    @Override
    public void onMessage(WebSocket webSocket, String text) {
        super.onMessage(webSocket, text);
        try {
            JSONObject jsonObject = new JSONObject(text);
            String type = jsonObject.optString("type");
            String cmd = jsonObject.optString("cmd");
            JSONObject payload = jsonObject.optJSONObject("payload");
            for (Interceptor interceptor : interceptors) {
                if (interceptor.intercept(type, cmd, payload)) {
                    return;
                }
            }
            if ("DEBUG_REQ".equals(cmd)) {
                String source = payload.optString("source");
                DevKit.getInstance().startDebugging(source);
            } else if ("DEBUG_STOP".equals(cmd)) {
                DevKit.getInstance().stopDebugging(true);
            } else if ("RELOAD".equals(cmd)) {
                String source = payload.optString("source");
                String script = payload.optString("script");
                DevKit.getInstance().reload(source, script);
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
        EventBus.getDefault().post(new ConnectExceptionEvent());
    }

    @Override
    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
        super.onFailure(webSocket, t, response);

        if (t instanceof EOFException) {
            EventBus.getDefault().post(new EOFExceptionEvent());
        } else if (t instanceof ConnectException) {
            EventBus.getDefault().post(new ConnectExceptionEvent());
        }
    }

    public void sendToDebugger(String command, JSONObject payload) {
        webSocket.send(new JSONBuilder()
                .put("type", "C2D")
                .put("cmd", command)
                .put("payload", payload)
                .toString());
    }

    public void sendToServer(String command, JSONObject payload) {
        webSocket.send(new JSONBuilder()
                .put("type", "C2S")
                .put("cmd", command)
                .put("payload", payload)
                .toString());
    }

}
