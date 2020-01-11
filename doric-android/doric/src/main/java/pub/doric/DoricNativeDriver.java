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
package pub.doric;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import pub.doric.async.AsyncCall;
import pub.doric.async.AsyncResult;
import pub.doric.engine.DoricJSEngine;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.ThreadMode;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricNativeDriver implements IDoricDriver {
    private final DoricJSEngine doricJSEngine;
    private final ExecutorService mBridgeExecutor;
    private final Handler mUIHandler;
    private final Handler mJSHandler;

    private static class Inner {
        private static final DoricNativeDriver sInstance = new DoricNativeDriver();
    }

    private DoricNativeDriver() {
        doricJSEngine = new DoricJSEngine();
        mBridgeExecutor = Executors.newCachedThreadPool();
        mUIHandler = new Handler(Looper.getMainLooper());
        mJSHandler = doricJSEngine.getJSHandler();
    }

    public static DoricNativeDriver getInstance() {
        return Inner.sInstance;
    }

    @Override
    public AsyncResult<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = contextId;
        nArgs[1] = method;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        return invokeDoricMethod(DoricConstant.DORIC_CONTEXT_INVOKE, nArgs);
    }

    @Override
    public AsyncResult<JSDecoder> invokeDoricMethod(final String method, final Object... args) {
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<JSDecoder>() {
            @Override
            public JSDecoder call() {
                try {
                    return doricJSEngine.invokeDoricMethod(method, args);
                } catch (Exception e) {
                    doricJSEngine.onException(e);
                    doricJSEngine.onLog(Log.ERROR, String.format("invokeDoricMethod(%s,...),error is %s", method, e.getLocalizedMessage()));
                    return new JSDecoder(null);
                }
            }
        });
    }

    @Override
    public <T> AsyncResult<T> asyncCall(Callable<T> callable, ThreadMode threadMode) {
        switch (threadMode) {
            case JS:
                return AsyncCall.ensureRunInHandler(mJSHandler, callable);
            case UI:
                return AsyncCall.ensureRunInHandler(mUIHandler, callable);
            case INDEPENDENT:
            default:
                return AsyncCall.ensureRunInExecutor(mBridgeExecutor, callable);
        }
    }

    @Override
    public AsyncResult<Boolean> createContext(final String contextId, final String script, final String source) {
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<Boolean>() {
            @Override
            public Boolean call() {
                try {
                    doricJSEngine.prepareContext(contextId, script, source);
                    return true;
                } catch (Exception e) {
                    doricJSEngine.onException(e);
                    doricJSEngine.onLog(Log.ERROR, String.format("createContext %s error is %s", source, e.getLocalizedMessage()));
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
                    doricJSEngine.onException(e);
                    doricJSEngine.onLog(Log.ERROR, String.format("destroyContext %s error is %s", contextId, e.getLocalizedMessage()));
                    return false;
                }
            }
        });
    }

    @Override
    public DoricRegistry getRegistry() {
        return doricJSEngine.getRegistry();
    }
}
