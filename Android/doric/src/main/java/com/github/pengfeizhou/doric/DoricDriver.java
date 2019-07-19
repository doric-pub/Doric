package com.github.pengfeizhou.doric;

import com.github.pengfeizhou.doric.engine.DoricJSEngine;
import com.github.pengfeizhou.doric.utils.DoricSettableFuture;
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

    public DoricSettableFuture<JSDecoder> invokeContextMethod(final String contextId, final String method, final Object... args) {
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
        doricJSEngine.prepareContext(contextId, script, source);
        DoricContext doricContext = new DoricContext(contextId);
        doricContextMap.put(contextId, doricContext);
        return doricContext;
    }

    void destroyContext(String contextId) {
        doricContextMap.remove(contextId);
        doricJSEngine.destroyContext(contextId);
    }

    public DoricContext getContext(String contextId) {
        return doricContextMap.get(contextId);
    }

}
