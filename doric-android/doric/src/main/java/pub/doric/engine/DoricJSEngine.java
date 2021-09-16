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
package pub.doric.engine;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Nullable;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricRegistry;
import pub.doric.IDoricMonitor;
import pub.doric.extension.bridge.DoricBridgeExtension;
import pub.doric.extension.timer.DoricTimerExtension;
import pub.doric.performance.DoricPerformanceProfile;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.DoricLog;
import pub.doric.utils.DoricUtils;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricJSEngine implements Handler.Callback, DoricTimerExtension.TimerCallback, IDoricMonitor {
    private final HandlerThread handlerThread;
    private final Handler mJSHandler;
    private final DoricBridgeExtension mDoricBridgeExtension = new DoricBridgeExtension();
    protected IDoricJSE mDoricJSE;
    private final DoricTimerExtension mTimerExtension;
    private boolean initialized = false;
    private final DoricRegistry mDoricRegistry;
    private final Map<String, Object> mEnvironmentMap = new ConcurrentHashMap<>();
    private final DoricPerformanceProfile globalProfile = new DoricPerformanceProfile("JSEngine");

    public DoricJSEngine() {
        mDoricRegistry = new DoricRegistry(this);
        DoricPerformanceProfile.AnchorHook anchorHook = mDoricRegistry.getGlobalPerformanceAnchorHook();
        if (anchorHook != null) {
            globalProfile.addAnchorHook(anchorHook);
        }
        globalProfile.prepare(DoricPerformanceProfile.PART_INIT);
        handlerThread = new HandlerThread(this.getClass().getSimpleName());
        handlerThread.start();
        Looper looper = handlerThread.getLooper();
        mJSHandler = new Handler(looper, this);
        mJSHandler.post(new Runnable() {
            @Override
            public void run() {
                globalProfile.start(DoricPerformanceProfile.PART_INIT);
                initJSEngine();
                injectGlobal();
                initDoricRuntime();
                initialized = true;
                globalProfile.end(DoricPerformanceProfile.PART_INIT);
            }
        });
        mTimerExtension = new DoricTimerExtension(looper, this);
        mDoricRegistry.registerMonitor(this);
    }

    public Handler getJSHandler() {
        return mJSHandler;
    }

    protected void initJSEngine() {
        mDoricJSE = new DoricNativeJSExecutor();
    }

    public void setEnvironmentValue(Map<String, Object> values) {
        mEnvironmentMap.putAll(values);
        if (initialized) {
            final JSONBuilder jsonBuilder = new JSONBuilder();
            for (String k : mEnvironmentMap.keySet()) {
                jsonBuilder.put(k, mEnvironmentMap.get(k));
            }
            mJSHandler.post(new Runnable() {
                @Override
                public void run() {
                    mDoricJSE.injectGlobalJSObject(DoricConstant.INJECT_ENVIRONMENT,
                            new JavaValue(jsonBuilder.toJSONObject()));
                }
            });
            for (DoricContext context : DoricContextManager.aliveContexts()) {
                context.onEnvChanged();
            }
        }
    }

    private void injectGlobal() {
        String appName = "";
        String appVersion = "";
        Context context = Doric.application();
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(
                    context.getPackageName(), 0);
            int labelRes = packageInfo.applicationInfo.labelRes;
            appName = context.getResources().getString(labelRes);
            appVersion = packageInfo.versionName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        mEnvironmentMap.put("platform", "Android");
        mEnvironmentMap.put("platformVersion", String.valueOf(android.os.Build.VERSION.SDK_INT));
        mEnvironmentMap.put("appName", appName);
        mEnvironmentMap.put("appVersion", appVersion);
        mEnvironmentMap.put("screenWidth", DoricUtils.px2dp(DoricUtils.getScreenWidth()));
        mEnvironmentMap.put("screenHeight", DoricUtils.px2dp(DoricUtils.getScreenHeight()));
        mEnvironmentMap.put("screenScale", DoricUtils.getScreenScale());
        mEnvironmentMap.put("statusBarHeight", DoricUtils.px2dp(DoricUtils.getStatusBarHeight()));
        mEnvironmentMap.put("hasNotch", false);
        mEnvironmentMap.put("deviceBrand", Build.BRAND);
        mEnvironmentMap.put("deviceModel", Build.MODEL);
        mEnvironmentMap.put("localeLanguage", context.getResources().getConfiguration().locale.getLanguage());
        mEnvironmentMap.put("localeCountry", context.getResources().getConfiguration().locale.getCountry());

        JSONBuilder jsonBuilder = new JSONBuilder();
        for (String key : mEnvironmentMap.keySet()) {
            jsonBuilder.put(key, mEnvironmentMap.get(key));
        }
        mDoricJSE.injectGlobalJSObject(DoricConstant.INJECT_ENVIRONMENT,
                new JavaValue(jsonBuilder.toJSONObject()));
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_LOG, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String type = args[0].string();
                    String message = args[1].string();
                    switch (type) {
                        case "w":
                            mDoricRegistry.onLog(Log.WARN, message);
                            break;
                        case "e":
                            mDoricRegistry.onLog(Log.ERROR, message);
                            break;
                        default:
                            mDoricRegistry.onLog(Log.INFO, message);
                            break;
                    }
                } catch (Exception e) {
                    mDoricRegistry.onException(null, e);
                }
                return null;
            }
        });
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_REQUIRE, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String name = args[0].string();
                    String content = mDoricRegistry.acquireJSBundle(name);
                    if (TextUtils.isEmpty(content)) {
                        mDoricRegistry.onLog(Log.ERROR, String.format("require js bundle:%s is empty", name));
                        return new JavaValue(false);
                    }
                    mDoricJSE.loadJS(packageModuleScript(name, content), "Module://" + name);
                    return new JavaValue(true);
                } catch (Exception e) {
                    mDoricRegistry.onException(null, e);
                    return new JavaValue(false);
                }
            }
        });
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_TIMER_SET, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    mTimerExtension.setTimer(
                            args[0].number().longValue(),
                            args[1].number().longValue(),
                            args[2].bool());
                } catch (Exception e) {
                    mDoricRegistry.onException(null, e);
                }
                return null;
            }
        });
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_TIMER_CLEAR, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    mTimerExtension.clearTimer(args[0].number().longValue());
                } catch (Exception e) {
                    mDoricRegistry.onException(null, e);
                }
                return null;
            }
        });
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_BRIDGE, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String contextId = args[0].string();
                    String module = args[1].string();
                    String method = args[2].string();
                    String callbackId = args[3].string();
                    JSDecoder jsDecoder = args[4];
                    return mDoricBridgeExtension.callNative(contextId, module, method, callbackId, jsDecoder);
                } catch (Exception e) {
                    mDoricRegistry.onException(null, e);
                }
                return null;
            }
        });
    }

    private void initDoricRuntime() {
        try {
            loadBuiltinJS(DoricConstant.DORIC_BUNDLE_SANDBOX);
            String libName = DoricConstant.DORIC_MODULE_LIB;
            String libJS = DoricUtils.readAssetFile(DoricConstant.DORIC_BUNDLE_LIB);
            mDoricJSE.loadJS(packageModuleScript(libName, libJS), "Module://" + libName);
        } catch (Exception e) {
            mDoricRegistry.onException(null, e);
        }
    }

    @Override
    public boolean handleMessage(Message msg) {
        return false;
    }

    public void teardown() {
        mDoricJSE.teardown();
        mTimerExtension.teardown();
        handlerThread.quit();
        mJSHandler.removeCallbacksAndMessages(null);
    }

    private void loadBuiltinJS(String assetName) {
        String script = DoricUtils.readAssetFile(assetName);
        mDoricJSE.loadJS(script, "Assets://" + assetName);
    }

    public void prepareContext(final String contextId, final String script, final String source) {
        mDoricJSE.loadJS(packageContextScript(contextId, script), "Context://" + source);
    }

    public void destroyContext(final String contextId) {
        mDoricJSE.loadJS(String.format(DoricConstant.TEMPLATE_CONTEXT_DESTROY, contextId), "_Context://" + contextId);
    }

    private String packageContextScript(String contextId, String content) {
        return String.format(DoricConstant.TEMPLATE_CONTEXT_CREATE, content, contextId, contextId);
    }

    private String packageModuleScript(String moduleName, String content) {
        return String.format(DoricConstant.TEMPLATE_MODULE, moduleName, content);
    }

    public JSDecoder invokeDoricMethod(final String method, final Object... args) {
        ArrayList<JavaValue> values = new ArrayList<>();
        for (Object arg : args) {
            values.add(DoricUtils.toJavaValue(arg));
        }
        JSDecoder ret = mDoricJSE.invokeMethod(DoricConstant.GLOBAL_DORIC, method,
                values.toArray(new JavaValue[0]), false);
        if (!DoricConstant.DORIC_CONTEXT_INVOKE_PURE.equals(method)) {
            mDoricJSE.invokeMethod(DoricConstant.GLOBAL_DORIC, DoricConstant.DORIC_HOOK_NATIVE_CALL, new JavaValue[0], false);
        }
        return ret;
    }

    @Override
    public void callback(long timerId) {
        try {
            invokeDoricMethod(DoricConstant.DORIC_TIMER_CALLBACK, timerId);
        } catch (Exception e) {
            mDoricRegistry.onException(null, e);
            mDoricRegistry.onLog(
                    Log.ERROR,
                    String.format("Timer Callback error:%s", e.getLocalizedMessage()));
        }
    }

    public DoricRegistry getRegistry() {
        return mDoricRegistry;
    }

    @Override
    public void onException(@Nullable DoricContext context, Exception e) {
        Log.e(DoricJSEngine.class.getSimpleName(), "In source file: " + (context != null ? context.getSource() : "Unknown"));
        e.printStackTrace();
    }

    @Override
    public void onLog(int type, String message) {
        switch (type) {
            case Log.ERROR:
                DoricLog.suffix_e("_js", "%s", message);
                break;
            case Log.WARN:
                DoricLog.suffix_w("_js", "%s", message);
                break;
            default:
                DoricLog.suffix_d("_js", "%s", message);
                break;
        }
    }
}
