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

/**
 * @Description: com.github.penfeizhou.doric.async
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public class AsyncResult<R> {
    private enum State {
        IDLE,
        RESULT,
        ERROR,
    }

    private R result = null;
    private Callback<R> callback = null;
    private State state = State.IDLE;
    private Throwable throwable = null;

    public AsyncResult() {
    }

    public AsyncResult(R r) {
        this.result = r;
        this.state = State.RESULT;
    }

    public void setResult(R result) {
        this.result = result;
        this.state = State.RESULT;
        if (this.callback != null) {
            this.callback.onResult(result);
            this.callback.onFinish();
        }
    }

    public void setError(Throwable result) {
        this.throwable = result;
        this.state = State.ERROR;
        if (this.callback != null) {
            this.callback.onError(result);
            this.callback.onFinish();
        }
    }

    public boolean hasResult() {
        return this.state == State.RESULT;
    }

    public R getResult() {
        return result;
    }

    public void setCallback(Callback<R> callback) {
        this.callback = callback;
        if (this.state == State.ERROR) {
            this.callback.onError(throwable);
            this.callback.onFinish();
        } else if (this.state == State.RESULT) {
            this.callback.onResult(result);
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
