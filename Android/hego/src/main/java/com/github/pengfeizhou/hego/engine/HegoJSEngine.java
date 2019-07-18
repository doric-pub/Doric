package com.github.pengfeizhou.hego.engine;

import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;

import com.github.pengfeizhou.hego.Hego;
import com.github.pengfeizhou.hego.utils.HegoConstant;
import com.github.pengfeizhou.hego.utils.HegoLog;
import com.github.pengfeizhou.hego.utils.HegoSettableFuture;
import com.github.pengfeizhou.hego.utils.HegoUtils;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONObject;

import java.util.ArrayList;

/**
 * @Description: Hego
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoJSEngine implements Handler.Callback {
    private final Handler mJSHandler;
    private IHegoJSE mHegoJSE;

    public HegoJSEngine() {
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
    }


    private void initJSExecutor() {
        mHegoJSE = new HegoJSExecutor();
        mHegoJSE.injectGlobalJSFunction(HegoConstant.INJECT_LOG, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String type = args[0].string();
                    String message = args[1].string();
                    switch (type) {
                        case "w":
                            HegoLog.w(message, "_js");
                            break;
                        case "e":
                            HegoLog.e(message, "_js");
                            break;
                        default:
                            HegoLog.d(message, "_js");
                            break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return new JavaValue();
            }
        });
        mHegoJSE.injectGlobalJSFunction(HegoConstant.INJECT_REQUIRE, new JavaFunction() {
            @Override
            public JavaValue exec(JSDecoder[] args) {
                try {
                    String name = args[0].string();
                    String content = Hego.getJSModuleContent(name);
                    if (TextUtils.isEmpty(content)) {
                        HegoLog.e("error");
                        return new JavaValue(false);
                    }
                    mHegoJSE.loadJS(packageModuleScript(name, content), "Module://" + name);
                    return new JavaValue(true);
                } catch (Exception e) {
                    e.printStackTrace();
                    return new JavaValue(false);
                }
            }
        });
    }

    private void initHugoRuntime() {
        loadBuiltinJS("hego-sandbox.js");
        String libName = "./index";
        String libJS = HegoUtils.readAssetFile("hego-lib.js");
        mHegoJSE.loadJS(packageModuleScript(libName, libJS), "Module://" + libName);
    }

    @Override
    public boolean handleMessage(Message msg) {
        return false;
    }

    public void teardown() {
        mHegoJSE.teardown();
    }

    private void loadBuiltinJS(String assetName) {
        String script = HegoUtils.readAssetFile(assetName);
        mHegoJSE.loadJS(script, "Assets://" + assetName);
    }

    public void prepareContext(final String contextId, final String script, final String source) {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                mHegoJSE.loadJS(packageContextScript(contextId, script), "Context://" + source);
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
                mHegoJSE.loadJS(String.format(HegoConstant.TEMPLATE_CONTEXT_DESTORY, contextId), "_Context://" + contextId);
            }
        };
        doOnJSThread(runnable);
    }

    private String packageContextScript(String contextId, String content) {
        return String.format(HegoConstant.TEMPLATE_CONTEXT_CREATE, content, contextId, contextId);
    }

    private String packageModuleScript(String moduleName, String content) {
        return String.format(HegoConstant.TEMPLATE_MODULE, moduleName, content);
    }

    public boolean isJSThread() {
        return Looper.myLooper() == mJSHandler.getLooper();
    }

    public HegoSettableFuture<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = contextId;
        nArgs[1] = method;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        return invokeHegoMethod(HegoConstant.HEGO_CONTEXT_INVOKE, nArgs);
    }


    public HegoSettableFuture<JSDecoder> invokeHegoMethod(final String method, final Object... args) {
        final HegoSettableFuture<JSDecoder> settableFuture = new HegoSettableFuture<>();
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
                settableFuture.set(mHegoJSE.invokeMethod(HegoConstant.GLOBAL_HEGO, method,
                        values.toArray(new JavaValue[values.size()]), true));
            }
        };
        doOnJSThread(runnable);
        return settableFuture;
    }
}
