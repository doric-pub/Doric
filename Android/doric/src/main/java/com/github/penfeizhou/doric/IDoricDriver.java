package com.github.penfeizhou.doric;


import com.github.penfeizhou.doric.async.AsyncResult;
import com.github.pengfeizhou.jscore.JSDecoder;

/**
 * @Description: com.github.pengfeizhou.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public interface IDoricDriver {
    AsyncResult<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args);

    AsyncResult<JSDecoder> invokeDoricMethod(final String method, final Object... args);

    void runOnJS(Runnable runnable);

    void runOnUI(Runnable runnable);

    void runIndependently(Runnable runnable);

    AsyncResult<Boolean> createContext(final String contextId, final String script, final String source);

    AsyncResult<Boolean> destroyContext(final String contextId);
}
