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
package pub.doric.dev;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.util.Log;
import android.webkit.MimeTypeMap;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;

import com.github.pengfeizhou.jscore.JSONBuilder;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;

/**
 * @Description: com.github.penfeizhou.doricdemo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-08-03
 */
public class LocalServer extends NanoHTTPD {
    private final Context context;
    private Map<String, APICommand> commandMap = new HashMap<>();

    public LocalServer(Context context, int port) {
        super(port);
        this.context = context;
        commandMap.put("allContexts", new APICommand() {
            @Override
            public String name() {
                return "allContexts";
            }

            @Override
            public Object exec(IHTTPSession session) {
                Collection<DoricContext> ret = DoricContextManager.aliveContexts();
                JSONArray jsonArray = new JSONArray();
                for (DoricContext doricContext : ret) {
                    JSONBuilder jsonBuilder = new JSONBuilder();
                    jsonBuilder.put("source", doricContext.getSource());
                    jsonBuilder.put("id", doricContext.getContextId());
                    jsonArray.put(jsonBuilder.toJSONObject());
                }
                return jsonArray;
            }
        });
        commandMap.put("context", new APICommand() {
            @Override
            public String name() {
                return "context";
            }

            @Override
            public Object exec(IHTTPSession session) {
                String id = session.getParms().get("id");
                DoricContext doricContext = DoricContextManager.getContext(id);
                if (doricContext != null) {
                    return new JSONBuilder()
                            .put("id", doricContext.getContextId())
                            .put("source", doricContext.getSource())
                            .put("script", doricContext.getScript())
                            .toJSONObject();
                }
                return "{}";
            }
        });
        commandMap.put("reload", new APICommand() {
            @Override
            public String name() {
                return "reload";
            }

            @Override
            public Object exec(IHTTPSession session) {
                Map<String, String> files = new HashMap<>();
                try {
                    session.parseBody(files);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                String id = session.getParms().get("id");
                DoricContext doricContext = DoricContextManager.getContext(id);
                if (doricContext != null) {
                    try {
                        JSONObject jsonObject = new JSONObject(files.get("postData"));
                        doricContext.reload(jsonObject.optString("script"));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return "success";
                }
                return "fail";
            }
        });

    }

    private static String getIpAddressString() {
        try {
            for (Enumeration<NetworkInterface> enNetI = NetworkInterface
                    .getNetworkInterfaces(); enNetI.hasMoreElements(); ) {
                NetworkInterface netI = enNetI.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = netI
                        .getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (inetAddress instanceof Inet4Address && !inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return "0.0.0.0";
    }

    @Override
    public void start() throws IOException {
        super.start();
        Log.d("Debugger", String.format("Open http://%s:8910/index.html to start debug", getIpAddressString()));
    }

    @Override
    public Response serve(IHTTPSession session) {
        Uri uri = Uri.parse(session.getUri());
        List<String> segments = uri.getPathSegments();
        if (segments.size() > 1 && "api".equals(segments.get(0))) {
            String cmd = segments.get(1);
            APICommand apiCommand = commandMap.get(cmd);
            if (apiCommand != null) {
                Object ret = apiCommand.exec(session);
                return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, "application/json", ret.toString());
            }
        }
        String fileName = session.getUri().substring(1);
        AssetManager assetManager = context.getAssets();
        try {
            InputStream inputStream = assetManager.open("debugger/" + fileName);
            String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileName.substring(fileName.lastIndexOf(".") + 1));
            return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, mimeType, inputStream, inputStream.available());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return NanoHTTPD.newFixedLengthResponse(NanoHTTPD.Response.Status.OK, "text/html", "HelloWorld");
    }

    public interface APICommand {
        String name();

        Object exec(IHTTPSession session);
    }
}
