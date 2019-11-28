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
package pub.doric.async;

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;

/**
 * @Description: com.github.penfeizhou.doric.async
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public class AsyncCall {

    public static <T> AsyncResult<T> ensureRunInHandler(Handler handler, final Callable<T> callable) {
        final AsyncResult<T> asyncResult = new AsyncResult<>();
        if (Looper.myLooper() == handler.getLooper()) {
            try {
                asyncResult.setResult(callable.call());
            } catch (Exception e) {
                e.printStackTrace();
                asyncResult.setError(e);
            }
        } else {
            handler.post(new Runnable() {
                @Override
                public void run() {
                    try {
                        asyncResult.setResult(callable.call());
                    } catch (Exception e) {
                        e.printStackTrace();
                        asyncResult.setError(e);
                    }
                }
            });
        }
        return asyncResult;
    }

    public static <T> AsyncResult<T> ensureRunInExecutor(ExecutorService executorService, final Callable<T> callable) {
        final AsyncResult<T> asyncResult = new AsyncResult<>();
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    asyncResult.setResult(callable.call());
                } catch (Exception e) {
                    asyncResult.setError(e);
                }
            }
        });
        return asyncResult;
    }
}
