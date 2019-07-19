package com.github.pengfeizhou.doric;

import com.github.pengfeizhou.doric.async.AsyncResult;
import com.github.pengfeizhou.doric.engine.DoricJSEngine;
import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricDriver {
    private final DoricJSEngine doricJSEngine;
    private final AtomicInteger counter = new AtomicInteger();
    private final Map<String, DoricContext> doricContextMap = new ConcurrentHashMap<>();

    public AsyncResult<JSDecoder> invokeContextMethod(final String contextId, final String method, final Object... args) {
        return doricJSEngine.invokeContextEntityMethod(contextId, method, args);
    }

    private static class Inner {
        private static final DoricDriver sInstance = new DoricDriver();
    }

    private DoricDriver() {
        doricJSEngine = new DoricJSEngine();
    }

    public static DoricDriver getInstance() {
        return Inner.sInstance;
    }

    DoricContext createContext(final String script, final String source) {
        String contextId = String.valueOf(counter.incrementAndGet());
        DoricContext doricContext = new DoricContext(contextId);
        doricJSEngine.prepareContext(contextId, script, source);
        doricContextMap.put(contextId, doricContext);
        return doricContext;
    }

    void destroyContext(final String contextId) {
        doricJSEngine.destroyContext(contextId).setCallback(new AsyncResult.Callback<Boolean>() {
            @Override
            public void onResult(Boolean result) {
            }

            @Override
            public void onError(Throwable t) {
            }

            @Override
            public void onFinish() {
                doricContextMap.remove(contextId);
            }
        });
    }

    public DoricContext getContext(String contextId) {
        return doricContextMap.get(contextId);
    }

}
