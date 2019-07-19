package com.github.pengfeizhou.doric.async;

/**
 * @Description: com.github.pengfeizhou.doric.async
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public class AsyncResult<R> {
    private static Object EMPTY = new Object();
    private Object result = EMPTY;

    private Callback<R> callback = null;

    public void setResult(R result) {
        this.result = result;
        if (this.callback != null) {
            this.callback.onResult(result);
            this.callback.onFinish();
        }
    }

    public void setError(Throwable result) {
        this.result = result;
        if (this.callback != null) {
            this.callback.onError(result);
            this.callback.onFinish();
        }
    }

    public void setCallback(Callback<R> callback) {
        this.callback = callback;
        if (result instanceof Throwable) {
            this.callback.onError((Throwable) result);
            this.callback.onFinish();
        } else if (result != EMPTY) {
            this.callback.onResult((R) result);
            this.callback.onFinish();
        }
    }

    public SettableFuture<R> synchronous() {
        final SettableFuture<R> settableFuture = new SettableFuture<>();

        setCallback(new Callback<R>() {
            @Override
            public void onResult(R result) {
                settableFuture.set(result);
            }

            @Override
            public void onError(Throwable t) {
                settableFuture.set(null);
            }

            @Override
            public void onFinish() {

            }
        });
        return settableFuture;
    }

    public interface Callback<R> {
        void onResult(R result);

        void onError(Throwable t);

        void onFinish();
    }
}
