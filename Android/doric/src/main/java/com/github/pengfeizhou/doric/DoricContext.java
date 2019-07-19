package com.github.pengfeizhou.doric;

import com.github.pengfeizhou.doric.utils.DoricSettableFuture;
import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricContext {
    private static AtomicInteger sCounter = new AtomicInteger();
    private final String mContextId;

    private DoricContext(String contextId) {
        this.mContextId = contextId;
    }

    public static DoricContext createContext(String script, String alias) {
        String contextId = String.valueOf(sCounter.incrementAndGet());
        DoricDriver.getInstance().createContext(contextId, script, alias);
        return new DoricContext(contextId);
    }

    public DoricSettableFuture<JSDecoder> callEntity(String methodName, Object... args) {
        return DoricDriver.getInstance().invokeContextMethod(mContextId, methodName, args);
    }

    public void teardown() {
        DoricDriver.getInstance().destroyContext(mContextId);
    }
}
