package com.github.pengfeizhou.doric;

import com.github.pengfeizhou.doric.async.AsyncCall;
import com.github.pengfeizhou.doric.async.AsyncResult;
import com.github.pengfeizhou.doric.utils.DoricLog;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Description: com.github.pengfeizhou.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public class DoricContextManager {

    private final AtomicInteger counter = new AtomicInteger();
    private final Map<String, DoricContext> doricContextMap = new ConcurrentHashMap<>();


    private static class Inner {
        private static final DoricContextManager sInstance = new DoricContextManager();
    }

    private DoricContextManager() {

    }

    public static DoricContextManager getInstance() {
        return Inner.sInstance;
    }

    DoricContext createContext(final String script, final String source) {
        final String contextId = String.valueOf(counter.incrementAndGet());
        final DoricContext doricContext = new DoricContext(contextId);
        doricContextMap.put(contextId, doricContext);
        doricContext.getDriver().createContext(contextId, script, source);
        return doricContext;
    }

    AsyncResult<Boolean> destroyContext(final DoricContext context) {
        final AsyncResult<Boolean> result = new AsyncResult<>();
        context.getDriver().destroyContext(context.getContextId()).setCallback(new AsyncResult.Callback<Boolean>() {
            @Override
            public void onResult(Boolean b) {
                result.setResult(b);
            }

            @Override
            public void onError(Throwable t) {
                result.setError(t);
            }

            @Override
            public void onFinish() {
                doricContextMap.remove(context.getContextId());
            }
        });
        return result;
    }

    public static DoricContext getContext(String contextId) {
        return getInstance().doricContextMap.get(contextId);
    }
}
