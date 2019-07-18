package com.github.pengfeizhou.hego;

import com.github.pengfeizhou.hego.utils.HegoSettableFuture;
import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Description: Hego
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoContext {
    private static AtomicInteger sCounter = new AtomicInteger();
    private final String mContextId;

    private HegoContext(String contextId) {
        this.mContextId = contextId;
    }

    public static HegoContext createContext(String script, String alias) {
        String contextId = String.valueOf(sCounter.incrementAndGet());
        HegoDriver.getInstance().createPage(contextId, script, alias);
        return new HegoContext(contextId);
    }

    public HegoSettableFuture<JSDecoder> callEntity(String methodName, Object... args) {
        return HegoDriver.getInstance().invokeContextMethod(mContextId, methodName, args);
    }

    public void teardown() {
        HegoDriver.getInstance().destoryContext(mContextId);
    }
}
