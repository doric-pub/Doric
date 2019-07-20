package com.github.penfeizhou.doric.async;

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;

/**
 * @Description: com.github.pengfeizhou.doric.async
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
                asyncResult.setError(e);
            }
        } else {
            handler.post(new Runnable() {
                @Override
                public void run() {
                    try {
                        asyncResult.setResult(callable.call());
                    } catch (Exception e) {
                        asyncResult.setError(e);
                    }
                }
            });
        }
        return asyncResult;
    }

    public static <T> AsyncResult<T> ensureRunIExecutor(ExecutorService executorService, final Callable<T> callable) {
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
