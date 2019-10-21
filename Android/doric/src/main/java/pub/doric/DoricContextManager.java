package pub.doric;

import android.content.Context;

import pub.doric.async.AsyncResult;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Description: com.github.penfeizhou.doric
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

    DoricContext createContext(Context context, final String script, final String source) {
        final String contextId = String.valueOf(counter.incrementAndGet());
        final DoricContext doricContext = new DoricContext(context, contextId, source);
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

    public static Set<String> getKeySet() {
        return getInstance().doricContextMap.keySet();
    }

    public static Collection<DoricContext> aliveContexts() {
        return getInstance().doricContextMap.values();
    }
}
