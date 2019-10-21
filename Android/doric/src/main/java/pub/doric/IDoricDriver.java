package pub.doric;


import pub.doric.async.AsyncResult;
import pub.doric.utils.ThreadMode;
import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.concurrent.Callable;

/**
 * @Description: com.github.penfeizhou.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public interface IDoricDriver {
    AsyncResult<JSDecoder> invokeContextEntityMethod(final String contextId, final String method, final Object... args);

    AsyncResult<JSDecoder> invokeDoricMethod(final String method, final Object... args);

    <T> AsyncResult<T> asyncCall(Callable<T> callable, ThreadMode threadMode);

    AsyncResult<Boolean> createContext(final String contextId, final String script, final String source);

    AsyncResult<Boolean> destroyContext(final String contextId);

    DoricRegistry getRegistry();

    void connectDevKit(String url);

    void disconnectDevKit();
}
