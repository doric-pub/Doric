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
package pub.doric.utils;

import android.os.Handler;
import android.os.Looper;

import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.LinkedList;
import java.util.concurrent.Callable;

import pub.doric.async.AsyncResult;

/**
 * @Description: pub.doric.utils
 * @Author: pengfei.zhou
 * @CreateDate: 2020-03-25
 */
public class DoricJSDispatcher implements AsyncResult.Callback<JSDecoder> {
    private final LinkedList<Callable<AsyncResult<JSDecoder>>> blocks = new LinkedList<>();
    private boolean consuming = false;
    private final Handler mHandler = new Handler(Looper.getMainLooper());

    public void dispatch(Callable<AsyncResult<JSDecoder>> block) {
        if (blocks.size() > 0) {
            blocks.clear();
        }
        blocks.push(block);
        if (!consuming) {
            consume();
        }
    }

    private void consume() {
        Callable<AsyncResult<JSDecoder>> block = blocks.pollLast();
        if (block != null) {
            consuming = true;
            try {
                AsyncResult<JSDecoder> result = block.call();
                result.setCallback(this);
            } catch (Exception e) {
                e.printStackTrace();
                consume();
            }
        } else {
            consuming = false;
        }
    }

    @Override
    public void onResult(JSDecoder result) {

    }

    @Override
    public void onError(Throwable t) {

    }

    @Override
    public void onFinish() {
        if (Looper.myLooper() == mHandler.getLooper()) {
            consume();
        } else {
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    consume();
                }
            });
        }
    }

    public void clear() {
        blocks.clear();
    }
}
