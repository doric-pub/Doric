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
import pub.doric.performance.DoricPerformanceProfile;
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

    public DoricNativeDriver() {
        doricJSEngine = new DoricJSEngine();
        mBridgeExecutor = Executors.newCachedThreadPool();
        mUIHandler = new Handler(Looper.getMainLooper());
        mJSHandler = doricJSEngine.getJSHandler();
    }

    @Override
    public AsyncResult<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args) {
        final AsyncResult<JSDecoder> asyncResult = new AsyncResult<>();
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = contextId;
        nArgs[1] = method;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        invokeDoricMethod(DoricConstant.DORIC_CONTEXT_INVOKE, nArgs).setCallback(new AsyncResult.Callback<JSDecoder>() {
            @Override
            public void onResult(JSDecoder result) {
                asyncResult.setResult(result);
            }

            @Override
            public void onError(Throwable t) {
                asyncResult.setError(t);
                getRegistry().onException(
                        DoricContextManager.getContext(contextId),
                        t instanceof Exception ? (Exception) t : new RuntimeException(t));
            }

            @Override
            public void onFinish() {
            }
        });
        return asyncResult;
    }

    @Override
    public AsyncResult<JSDecoder> invokeDoricMethod(final String method, final Object... args) {
        DoricPerformanceProfile profile = null;
        Object contextId = args.length > 0 ? args[0] : null;
        if (contextId instanceof String) {
            DoricContext context = DoricContextManager.getContext((String) contextId);
            if (context != null) {
                profile = context.getPerformanceProfile();
            }
        }
        StringBuilder stringBuilder = new StringBuilder(DoricPerformanceProfile.STEP_Call)
                .append(":");
        for (Object object : args) {
            if (object == contextId) {
                continue;
            }
            stringBuilder.append(object.toString()).append(",");
        }
        final String anchorName = stringBuilder.toString();
        final DoricPerformanceProfile finalProfile = profile;
        if (finalProfile != null) {
            finalProfile.prepare(anchorName);
        }
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<JSDecoder>() {
            @Override
            public JSDecoder call() {
                if (finalProfile != null) {
                    finalProfile.start(anchorName);
                }
                JSDecoder decoder = doricJSEngine.invokeDoricMethod(method, args);
                if (finalProfile != null) {
                    finalProfile.end(anchorName);
                }
                return decoder;
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

    private DoricPerformanceProfile getDoricPerformanceProfile(String contextId) {
        DoricContext doricContext = DoricContextManager.getContext(contextId);
        if (doricContext != null) {
            return doricContext.getPerformanceProfile();
        }
        return new DoricPerformanceProfile(contextId);
    }

    @Override
    public AsyncResult<Boolean> createContext(final String contextId, final String script, final String source) {
        final DoricPerformanceProfile profile = getDoricPerformanceProfile(contextId);
        profile.prepare(DoricPerformanceProfile.STEP_CREATE);
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<Boolean>() {
            @Override
            public Boolean call() {
                try {
                    profile.start(DoricPerformanceProfile.STEP_CREATE);
                    doricJSEngine.prepareContext(contextId, script, source);
                    profile.end(DoricPerformanceProfile.STEP_CREATE);
                    return true;
                } catch (Exception e) {
                    doricJSEngine.getRegistry().onException(DoricContextManager.getContext(contextId), e);
                    doricJSEngine.getRegistry().onLog(Log.ERROR, String.format("createContext %s error is %s", source, e.getLocalizedMessage()));
                    return false;
                }
            }
        });
    }

    @Override
    public AsyncResult<Boolean> destroyContext(final String contextId) {
        final DoricPerformanceProfile profile = getDoricPerformanceProfile(contextId);
        profile.prepare(DoricPerformanceProfile.STEP_DESTROY);
        return AsyncCall.ensureRunInHandler(mJSHandler, new Callable<Boolean>() {
            @Override
            public Boolean call() {
                try {
                    profile.start(DoricPerformanceProfile.STEP_DESTROY);
                    doricJSEngine.destroyContext(contextId);
                    profile.end(DoricPerformanceProfile.STEP_DESTROY);
                    return true;
                } catch (Exception e) {
                    doricJSEngine.getRegistry().onException(DoricContextManager.getContext(contextId), e);
                    doricJSEngine.getRegistry().onLog(Log.ERROR, String.format("destroyContext %s error is %s", contextId, e.getLocalizedMessage()));
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
