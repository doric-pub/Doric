package com.github.pengfeizhou.doric;

import com.github.pengfeizhou.doric.engine.DoricJSEngine;
import com.github.pengfeizhou.doric.utils.DoricSettableFuture;
import com.github.pengfeizhou.jscore.JSDecoder;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricDriver {
    private final DoricJSEngine doricJSEngine;

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

    public void createPage(final String contextId, final String script, final String source) {
        doricJSEngine.prepareContext(contextId, script, source);
    }

    public void destoryContext(String contextId) {
        doricJSEngine.destroyContext(contextId);
    }


}
