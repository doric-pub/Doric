package com.github.pengfeizhou.doric.engine;

import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;

import com.github.pengfeizhou.doric.Doric;
import com.github.pengfeizhou.doric.extension.DoricBridgeExtension;
import com.github.pengfeizhou.doric.utils.DoricConstant;
import com.github.pengfeizhou.doric.utils.DoricLog;
import com.github.pengfeizhou.doric.utils.DoricSettableFuture;
import com.github.pengfeizhou.doric.extension.DoricTimerExtension;
import com.github.pengfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONObject;

import java.util.ArrayList;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricJSEngine implements Handler.Callback, DoricTimerExtension.TimerCallback {
    private final Handler mJSHandler;
    private final DoricBridgeExtension mDoricBridgeExtension;
    private IDoricJSE mDoricJSE;
    private DoricTimerExtension mTimerExtension;

    public DoricJSEngine() {
        HandlerThread handlerThread = new HandlerThread(this.getClass().getSimpleName());
        handlerThread.start();
        Looper looper = handlerThread.getLooper();
        mJSHandler = new Handler(looper, this);
        mJSHandler.post(new Runnable() {
            @Override
            public void run() {
                initJSExecutor();
                initHugoRuntime();
            }
        });
        mTimerExtension = new DoricTimerExtension(looper, this);
        mDoricBridgeExtension = new DoricBridgeExtension();
    }


    private void initJSExecutor() {
        mDoricJSE = new DoricJSExecutor();
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_LOG, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String type = args[0].string();
                    String message = args[1].string();
                    switch (type) {
                        case "w":
                            DoricLog.w(message, "_js");
                            break;
                        case "e":
                            DoricLog.e(message, "_js");
                            break;
                        default:
                            DoricLog.d(message, "_js");
                            break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return null;
            }
        });
        mDoricJSE.injectGlobalJSFunction(DoricConstant.INJECT_REQUIRE, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String name = args[0].string();
                    String content = Doric.getJSBundle(name);
                    if (TextUtils.isEmpty(content)) {
                        DoricLog.e("error");
                        return new JavaValue(false);
                    }
                    mDoricJSE.loadJS(packageModuleScript(name, content), "Module://" + name);
                    return new JavaValue(true);
                } catch (Exception e) {
                    e.printStackTrace();
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
                    e.printStackTrace();
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
                    e.printStackTrace();
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
                    e.printStackTrace();
                }
                return null;
            }
        });
    }

    private void initHugoRuntime() {
        loadBuiltinJS(DoricConstant.DORIC_BUNDLE_SANDBOX);
        String libName = DoricConstant.DORIC_MODULE_LIB;
        String libJS = DoricUtils.readAssetFile(DoricConstant.DORIC_BUNDLE_LIB);
        mDoricJSE.loadJS(packageModuleScript(libName, libJS), "Module://" + libName);
    }

    @Override
    public boolean handleMessage(Message msg) {
        return false;
    }

    public void teardown() {
        mDoricJSE.teardown();
    }

    private void loadBuiltinJS(String assetName) {
        String script = DoricUtils.readAssetFile(assetName);
        mDoricJSE.loadJS(script, "Assets://" + assetName);
    }

    public void prepareContext(final String contextId, final String script, final String source) {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                mDoricJSE.loadJS(packageContextScript(contextId, script), "Context://" + source);
            }
        };
        doOnJSThread(runnable);
    }

    public void doOnJSThread(Runnable runnable) {
        if (isJSThread()) {
            runnable.run();
        } else {
            mJSHandler.post(runnable);
        }
    }

    public void destroyContext(final String contextId) {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                mDoricJSE.loadJS(String.format(DoricConstant.TEMPLATE_CONTEXT_DESTROY, contextId), "_Context://" + contextId);
            }
        };
        doOnJSThread(runnable);
    }

    private String packageContextScript(String contextId, String content) {
        return String.format(DoricConstant.TEMPLATE_CONTEXT_CREATE, content, contextId, contextId);
    }

    private String packageModuleScript(String moduleName, String content) {
        return String.format(DoricConstant.TEMPLATE_MODULE, moduleName, content);
    }

    public boolean isJSThread() {
        return Looper.myLooper() == mJSHandler.getLooper();
    }

    public DoricSettableFuture<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = contextId;
        nArgs[1] = method;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        return invokeDoricMethod(DoricConstant.DORIC_CONTEXT_INVOKE, nArgs);
    }


    public DoricSettableFuture<JSDecoder> invokeDoricMethod(final String method, final Object... args) {
        final DoricSettableFuture<JSDecoder> settableFuture = new DoricSettableFuture<>();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                ArrayList<JavaValue> values = new ArrayList<>();
                for (Object arg : args) {
                    if (arg == null) {
                        values.add(new JavaValue());
                    } else if (arg instanceof JSONObject) {
                        values.add(new JavaValue((JSONObject) arg));
                    } else if (arg instanceof String) {
                        values.add(new JavaValue((String) arg));
                    } else if (arg instanceof Integer) {
                        values.add(new JavaValue((Integer) arg));
                    } else if (arg instanceof Long) {
                        values.add(new JavaValue((Long) arg));
                    } else if (arg instanceof Double) {
                        values.add(new JavaValue((Double) arg));
                    } else if (arg instanceof Boolean) {
                        values.add(new JavaValue((Boolean) arg));
                    } else if (arg instanceof JavaValue) {
                        values.add((JavaValue) arg);
                    } else {
                        values.add(new JavaValue(String.valueOf(arg)));
                    }
                }
                settableFuture.set(mDoricJSE.invokeMethod(DoricConstant.GLOBAL_DORIC, method,
                        values.toArray(new JavaValue[values.size()]), true));
            }
        };
        doOnJSThread(runnable);
        return settableFuture;
    }

    @Override
    public void callback(long timerId) {
        invokeDoricMethod(DoricConstant.DORIC_TIMER_CALLBACK, timerId);
    }
}
