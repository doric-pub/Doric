package com.github.pengfeizhou.hego;

import com.github.pengfeizhou.jscore.JSDecoder;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoDriver {
    private final HegoJSEngine hegoJSEngine;

    public HegoSettableFuture<JSDecoder> invokeContextMethod(final String contextId, final String method, final Object... args) {
        return hegoJSEngine.invokeContextEntityMethod(contextId, method, args);
    }

    private static class Inner {
        private static final HegoDriver sInstance = new HegoDriver();
    }

    private HegoDriver() {
        hegoJSEngine = new HegoJSEngine();
    }

    public static HegoDriver getInstance() {
        return Inner.sInstance;
    }

    public void createPage(final String contextId, final String script, final String source) {
        hegoJSEngine.prepareContext(contextId, script, source);
    }

    public void destoryContext(String contextId) {
        hegoJSEngine.destroyContext(contextId);
    }


}
