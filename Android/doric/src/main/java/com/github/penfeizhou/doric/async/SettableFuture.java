package com.github.penfeizhou.doric.async;

/**
 * @Description: com.github.penfeizhou.doric.async
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * A super simple Future-like class that can safely notify another Thread when a value is ready.
 * Does not support setting errors or canceling.
 */
public class SettableFuture<T> {

    private final CountDownLatch mReadyLatch = new CountDownLatch(1);
    private volatile
    T mResult;

    /**
     * Sets the result. If another thread has called {@link #get}, they will immediately receive the
     * value. Must only be called once.
     */
    public void set(T result) {
        if (mReadyLatch.getCount() == 0) {
            throw new RuntimeException("Result has already been set!");
        }
        mResult = result;
        mReadyLatch.countDown();
    }

    /**
     * Wait up to the timeout time for another Thread to set a value on this future. If a value has
     * already been set, this method will return immediately.
     * <p>
     * NB: For simplicity, we catch and wrap InterruptedException. Do NOT use this class if you
     * are in the 1% of cases where you actually want to handle that.
     */
    public T get(long timeoutMS) {
        try {
            if (!mReadyLatch.await(timeoutMS, TimeUnit.MILLISECONDS)) {
                throw new TimeoutException();
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return mResult;
    }

    public static class TimeoutException extends RuntimeException {

        public TimeoutException() {
            super("Timed out waiting for future");
        }
    }
}
