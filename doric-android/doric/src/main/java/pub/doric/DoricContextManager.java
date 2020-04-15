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

    DoricContext createContext(Context context, final String script, final String source, String extra) {
        final String contextId = String.valueOf(counter.incrementAndGet());
        final DoricContext doricContext = new DoricContext(context, contextId, source, extra);
        doricContextMap.put(contextId, doricContext);
        if (script.startsWith("(function (_, Kotlin) {")) {
            doricContext.es5Mode = true;
        }
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
