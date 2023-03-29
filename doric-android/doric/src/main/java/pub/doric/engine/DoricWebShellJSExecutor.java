/*
 * Copyright [2021] [Doric.Pub]
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
package pub.doric.engine;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Base64;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import pub.doric.async.SettableFuture;
import pub.doric.utils.DoricLog;
import pub.doric.utils.DoricUtils;


/**
 * @Description: This uses a webView to execute JavaScript
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/3
 */
public class DoricWebShellJSExecutor implements IDoricJSE {
    private WebView webView;
    private final Map<String, JavaFunction> globalFunctions = new HashMap<>();
    private final Handler handler;
    private static final Map<String, SoftReference<byte[]>> arrayBuffers = new HashMap<>();
    private static final AtomicInteger arrayBufferId = new AtomicInteger();

    private static Object unwrapJSObject(JSONObject jsonObject) {
        String type = jsonObject.optString("type");
        switch (type) {
            case "number":
                return jsonObject.optDouble("value");
            case "string":
                return jsonObject.optString("value");
            case "boolean":
                return jsonObject.optBoolean("value");
            case "object":
                try {
                    return new JSONObject(jsonObject.optString("value"));
                } catch (JSONException e) {
                    e.printStackTrace();
                    return JSONObject.NULL;
                }
            case "array":
                try {
                    return new JSONArray(jsonObject.optString("value"));
                } catch (JSONException e) {
                    e.printStackTrace();
                    return JSONObject.NULL;
                }
            case "arrayBuffer":
                String base64 = jsonObject.optString("value");
                return Base64.decode(base64, Base64.NO_WRAP);
            default:
                return JSONObject.NULL;
        }
    }

    private static JSONObject wrapJavaValue(JavaValue javaValue) {
        if (javaValue == null || javaValue.getType() == 0) {
            return WRAPPED_NULL;
        }
        if (javaValue.getType() == 1) {
            Double value = Double.valueOf(javaValue.getValue());
            return new JSONBuilder().put("type", "number").put("value", value).toJSONObject();
        }
        if (javaValue.getType() == 2) {
            Boolean value = Boolean.valueOf(javaValue.getValue());
            return new JSONBuilder().put("type", "boolean").put("value", value).toJSONObject();
        }
        if (javaValue.getType() == 3) {
            String value = String.valueOf(javaValue.getValue());
            return new JSONBuilder().put("type", "string").put("value", value).toJSONObject();
        }
        if (javaValue.getType() == 4) {
            String value = String.valueOf(javaValue.getValue());
            try {
                return new JSONBuilder().put("type", "object").put("value", new JSONObject(value)).toJSONObject();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        if (javaValue.getType() == 5) {
            String value = String.valueOf(javaValue.getValue());
            try {
                return new JSONBuilder().put("type", "array").put("value", new JSONArray(value)).toJSONObject();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        if (javaValue.getType() == 6) {
            byte[] data = javaValue.getByteData();
            String id = String.valueOf(arrayBufferId.incrementAndGet());
            arrayBuffers.put(id, new SoftReference<>(data));
            return new JSONBuilder().put("type", "arrayBuffer").put("value", id).toJSONObject();
        }
        return WRAPPED_NULL;
    }

    private static final JSONObject WRAPPED_NULL = new JSONBuilder().put("type", "null").toJSONObject();

    private static final String WRAPPED_NULL_STRING = WRAPPED_NULL.toString();
    private SettableFuture<String> returnFuture = null;

    public class WebViewCallback {
        @JavascriptInterface
        public void ready() {
            DoricLog.d("Ready");
            readyFuture.set(true);
        }

        @JavascriptInterface
        public String fetchArrayBuffer(String arrayBufferId) {
            SoftReference<byte[]> ref = arrayBuffers.remove(arrayBufferId);
            if (ref != null && ref.get() != null) {
                byte[] data = ref.get();
                return Base64.encodeToString(data, Base64.NO_WRAP);
            }
            return "";
        }

        @JavascriptInterface
        public void log(String message) {
            DoricLog.d(message);
        }

        @JavascriptInterface
        public void returnNative(String result) {
            DoricLog.d("return Native" + result);
            if (returnFuture != null) {
                returnFuture.set(result);
            }
        }

        @JavascriptInterface
        public String callNative(String name, String arguments) {
            JavaFunction javaFunction = globalFunctions.get(name);
            if (javaFunction == null) {
                DoricLog.e("Cannot find global function %s", name);
                return WRAPPED_NULL_STRING;
            }
            try {
                JSONArray jsonArray = new JSONArray(arguments);
                int length = jsonArray.length();
                JSDecoder[] decoders = new JSDecoder[length];
                for (int i = 0; i < length; i++) {
                    JSONObject jsonObject = jsonArray.optJSONObject(i);
                    Object object = unwrapJSObject(jsonObject);
                    decoders[i] = new DoricJSDecoder(object);
                }
                JavaValue javaValue = javaFunction.exec(decoders);
                return wrapJavaValue(javaValue).toString();
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return WRAPPED_NULL_STRING;
        }
    }

    private static class DoricWebChromeClient extends WebChromeClient {
        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            return super.onJsAlert(view, url, message, result);
        }

        @Override
        public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
            ConsoleMessage.MessageLevel messageLevel = consoleMessage.messageLevel();
            if (messageLevel == ConsoleMessage.MessageLevel.ERROR) {
                DoricLog.e(consoleMessage.message());
            } else if (messageLevel == ConsoleMessage.MessageLevel.WARNING) {
                DoricLog.w(consoleMessage.message());
            } else {
                DoricLog.d(consoleMessage.message());
            }
            return true;
        }
    }

    private interface ResourceInterceptor {
        boolean filter(String url);

        WebResourceResponse onIntercept(String url);
    }

    private final SettableFuture<Boolean> readyFuture;
    private final Set<ResourceInterceptor> resourceInterceptors = new HashSet<>();

    private class DoricWebViewClient extends WebViewClient {
        @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
        @Nullable
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();
            for (ResourceInterceptor interceptor : resourceInterceptors) {
                if (interceptor.filter(url)) {
                    WebResourceResponse webResourceResponse = interceptor.onIntercept(url);
                    if (webResourceResponse != null) {
                        return webResourceResponse;
                    }
                }
            }
            return null;
        }

        @Nullable
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            for (ResourceInterceptor interceptor : resourceInterceptors) {
                if (interceptor.filter(url)) {
                    WebResourceResponse webResourceResponse = interceptor.onIntercept(url);
                    if (webResourceResponse != null) {
                        return webResourceResponse;
                    }
                }
            }
            return null;
        }
    }

    private final String shellUrl = "http://shell.doric/";

    private final Map<String, String> loadingScripts = new HashMap<>();
    private final AtomicInteger scriptId = new AtomicInteger(0);

    @SuppressLint({"JavascriptInterface", "SetJavaScriptEnabled", "AddJavascriptInterface"})
    public DoricWebShellJSExecutor(final Context context) {
        resourceInterceptors.add(new ResourceInterceptor() {
            @Override
            public boolean filter(String url) {
                return url.startsWith(shellUrl + "doric-web.html");
            }

            @Override
            public WebResourceResponse onIntercept(String url) {
                String content = DoricUtils.readAssetBinFile("doric-web.html");
                InputStream inputStream = new ByteArrayInputStream(content.getBytes());
                return new WebResourceResponse("text/html", "utf-8", inputStream);
            }
        });
        resourceInterceptors.add(new ResourceInterceptor() {
            @Override
            public boolean filter(String url) {
                return url.startsWith(shellUrl + "doric-web.js");
            }

            @Override
            public WebResourceResponse onIntercept(String url) {
                String content = DoricUtils.readAssetBinFile("doric-web.js");
                InputStream inputStream = new ByteArrayInputStream(content.getBytes());
                return new WebResourceResponse("text/javascript", "utf-8", inputStream);
            }
        });
        resourceInterceptors.add(new ResourceInterceptor() {
            @Override
            public boolean filter(String url) {
                return url.startsWith(shellUrl + "script/");
            }

            @Override
            public WebResourceResponse onIntercept(String url) {
                String script = loadingScripts.remove(url);
                if (TextUtils.isEmpty(script)) {
                    return null;
                }
                assert script != null;
                InputStream inputStream = new ByteArrayInputStream(script.getBytes());
                return new WebResourceResponse("text/javascript", "utf-8", inputStream);
            }
        });

        HandlerThread webViewHandlerThread = new HandlerThread("DoricWebViewJSExecutor");
        webViewHandlerThread.start();
        readyFuture = new SettableFuture<>();
        handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                webView = new WebView(context.getApplicationContext());
                WebSettings webSettings = webView.getSettings();
                webSettings.setJavaScriptEnabled(true);
                webSettings.setSavePassword(false);
                webView.setWebChromeClient(new DoricWebChromeClient());
                webView.setWebViewClient(new DoricWebViewClient());
                WebViewCallback webViewCallback = new WebViewCallback();
                webView.addJavascriptInterface(webViewCallback, "NativeClient");
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && BuildConfig.DEBUG) {
//                    WebView.setWebContentsDebuggingEnabled(true);
//                }
                webView.loadUrl(shellUrl + "doric-web.html");
            }
        });
        readyFuture.get();
    }


    private void execJS(final String script) {
        this.handler.post(new Runnable() {
            @Override
            public void run() {
                webView.loadUrl(String.format("javascript:%s", script));
            }
        });
    }

    public void removeScript(String scriptId) {
        execJS(String.format("javascript:removeScriptElement('%s')", scriptId));
    }

    @Override
    public String loadJS(final String script, String source) {
        String uniqueId = String.valueOf(scriptId.incrementAndGet());
        String url = shellUrl + "script/" + uniqueId;
        loadingScripts.put(url, script);
        execJS(String.format("javascript:addScriptElement('%s','%s')", uniqueId, url));
        return uniqueId;
    }

    @Override
    public JSDecoder evaluateJS(final String script, String source, boolean hashKey) throws JSRuntimeException {
        execJS(script);
        return null;
    }

    @Override
    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {
        globalFunctions.put(name, javaFunction);
        execJS(String.format("__injectGlobalFunction('%s')", name));
    }

    @Override
    public void injectGlobalJSObject(String name, JavaValue javaValue) {
        execJS(String.format("__injectGlobalObject('%s','%s')", name, javaValue.getValue()));
    }

    @Override
    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException {
        JSONArray jsonArray = new JSONArray();
        for (JavaValue javaValue : javaValues) {
            JSONObject jsonObject = wrapJavaValue(javaValue);
            jsonArray.put(jsonObject);
        }
        returnFuture = new SettableFuture<>();
        final String script = String.format(
                "__invokeMethod('%s','%s','%s')",
                objectName,
                functionName,
                jsonArray.toString());
        execJS(script);
        String result = returnFuture.get();
        returnFuture = null;
        if (!TextUtils.isEmpty(result)) {
            try {
                JSONObject jsonObject = new JSONObject(result);
                Object object = unwrapJSObject(jsonObject);
                return new DoricJSDecoder(object);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @Override
    public void teardown() {
    }
}
