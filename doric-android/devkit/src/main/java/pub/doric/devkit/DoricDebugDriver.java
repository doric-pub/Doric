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

import android.os.Handler;
import android.os.Looper;

import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import pub.doric.DoricRegistry;
import pub.doric.IDoricDriver;
import pub.doric.async.AsyncCall;
import pub.doric.async.AsyncResult;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.DoricLog;
import pub.doric.utils.ThreadMode;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricDebugDriver implements IDoricDriver {
    private final DoricDebugJSEngine doricDebugJSEngine;
    private final ExecutorService mBridgeExecutor;
    private final Handler mUIHandler;
    private final Handler mJSHandler;
    private String theContextId = null;

    public DoricDebugDriver(WSClient wsClient) {
        doricDebugJSEngine = new DoricDebugJSEngine(wsClient);
        mBridgeExecutor = Executors.newCachedThreadPool();
        mUIHandler = new Handler(Looper.getMainLooper());
        mJSHandler = doricDebugJSEngine.getJSHandler();
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
                    return doricDebugJSEngine.invokeDoricMethod(method, args);
                } catch (Exception e) {
                    DoricLog.e("invokeDoricMethod(%s,...),error is %s", method, e.getLocalizedMessage());
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
                    theContextId = contextId;
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
                    if (contextId.equals(theContextId)) {
                        DevKit.getInstance().stopDebugging(false);
                    }
                    return true;
                } catch (Exception e) {
                    DoricLog.e("destroyContext %s error is %s", contextId, e.getLocalizedMessage());
                    return false;
                }
            }
        });
    }

    @Override
    public DoricRegistry getRegistry() {
        return doricDebugJSEngine.getRegistry();
    }

    public void destroy() {
        doricDebugJSEngine.teardown();
        mBridgeExecutor.shutdown();
    }
}
