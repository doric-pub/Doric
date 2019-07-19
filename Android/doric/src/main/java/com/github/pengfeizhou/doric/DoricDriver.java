package com.github.pengfeizhou.doric;

import android.os.Handler;
import android.os.Looper;

import com.github.pengfeizhou.doric.async.AsyncCall;
import com.github.pengfeizhou.doric.async.AsyncResult;
import com.github.pengfeizhou.doric.engine.DoricJSEngine;
import com.github.pengfeizhou.doric.utils.DoricConstant;
import com.github.pengfeizhou.doric.utils.DoricLog;
import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricDriver implements IDoricDriver {
    private final DoricJSEngine doricJSEngine;
    private final ExecutorService mBridgeExecutor;
    private final Handler mUIHandler;
    private final Handler mJSHandler;

    public AsyncResult<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = contextId;
        nArgs[1] = method;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        return invokeDoricMethod(DoricConstant.DORIC_CONTEXT_INVOKE, nArgs);
    }

    public AsyncResult<JSDecoder> invokeDoricMethod(final String method, final Object... args) {
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<JSDecoder>() {
            @Override
            public JSDecoder call() {
                try {
                    return doricJSEngine.invokeDoricMethod(method, args);
                } catch (Exception e) {
                    DoricLog.e("invokeDoricMethod(%s,...),error is %s", method, e.getLocalizedMessage());
                    return new JSDecoder(null);
                }
            }
        });
    }

    private static class Inner {
        private static final DoricDriver sInstance = new DoricDriver();
    }

    private DoricDriver() {
        doricJSEngine = new DoricJSEngine();
        mBridgeExecutor = Executors.newCachedThreadPool();
        mUIHandler = new Handler(Looper.getMainLooper());
        mJSHandler = doricJSEngine.getJSHandler();
    }

    public void runOnJS(Runnable runnable) {
        mJSHandler.post(runnable);
    }

    public void runOnUI(Runnable runnable) {
        mUIHandler.post(runnable);
    }

    public void runIndependently(Runnable runnable) {
        mBridgeExecutor.execute(runnable);
    }

    public static DoricDriver getInstance() {
        return Inner.sInstance;
    }

    public AsyncResult<Boolean> createContext(final String contextId, final String script, final String source) {
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<Boolean>() {
            @Override
            public Boolean call() {
                try {
                    doricJSEngine.prepareContext(contextId, script, source);
                    return true;
                } catch (Exception e) {
                    DoricLog.e("createContext %s error is %s", source, e.getLocalizedMessage());
                    return false;
                }
            }
        });
    }

    @Override
    public AsyncResult<Boolean> destroyContext(final String contextId) {
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<Boolean>() {
            @Override
            public Boolean call() {
                try {
                    doricJSEngine.destroyContext(contextId);
                    return true;
                } catch (Exception e) {
                    DoricLog.e("destroyContext %s error is %s", contextId, e.getLocalizedMessage());
                    return false;
                }
            }
        });
    }
}
