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
import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.text.TextUtils;
import android.util.Base64;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import pub.doric.BuildConfig;
import pub.doric.async.SettableFuture;
import pub.doric.utils.DoricLog;


/**
 * @Description: This uses a webView to execute JavaScript
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/3
 */
@TargetApi(Build.VERSION_CODES.KITKAT)
public class DoricWebViewJSExecutor implements IDoricJSE {
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
        public void log(String message) {
            DoricLog.d(message);
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
        public void returnNative(String result) {
            DoricLog.d("return Native " + result);
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

    @SuppressLint({"JavascriptInterface", "SetJavaScriptEnabled"})
    public DoricWebViewJSExecutor(final Context context) {
        HandlerThread webViewHandlerThread = new HandlerThread("DoricWebViewJSExecutor");
        webViewHandlerThread.start();
        this.handler = new Handler(webViewHandlerThread.getLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                webView = new WebView(context.getApplicationContext());
                WebSettings webSettings = webView.getSettings();
                webSettings.setJavaScriptEnabled(true);
                webView.setWebChromeClient(new DoricWebChromeClient());
                webView.loadUrl("about:blank");
                WebViewCallback webViewCallback = new WebViewCallback();
                webView.addJavascriptInterface(webViewCallback, "NativeClient");
//                if (BuildConfig.DEBUG) {
//                    WebView.setWebContentsDebuggingEnabled(true);
//                }
            }
        });
    }

    @Override
    public String loadJS(final String script, String source) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript(script, null);
            }
        });
        return null;
    }

    @Override
    public JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException {
        loadJS(script, source);
        return null;
    }

    @Override
    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {
        globalFunctions.put(name, javaFunction);
        loadJS(String.format("__injectGlobalFunction('%s')", name), "");
    }

    @Override
    public void injectGlobalJSObject(String name, JavaValue javaValue) {
        loadJS(String.format("__injectGlobalObject('%s','%s')", name, javaValue.getValue()), "");
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
        loadJS(script, "");
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
