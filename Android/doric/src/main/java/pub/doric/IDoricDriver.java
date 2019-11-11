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


import pub.doric.async.AsyncResult;
import pub.doric.dev.ConnectCallback;
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

    void connectDevKit(String url, ConnectCallback connectCallback);

    void disconnectDevKit();
}
