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
package pub.doric.extension.bridge;

import android.util.Log;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.utils.DoricConstant;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: com.github.penfeizhou.doric.extension.bridge
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public class DoricPromise {
    private final DoricContext context;
    private final String callbackId;

    public DoricPromise(DoricContext context, String callbackId) {
        this.context = context;
        this.callbackId = callbackId;
    }

    public void resolve(JavaValue... javaValue) {
        Object[] params = new Object[javaValue.length + 2];
        params[0] = context.getContextId();
        params[1] = callbackId;
        System.arraycopy(javaValue, 0, params, 2, javaValue.length);
        context.getDriver()
                .invokeDoricMethod(
                        DoricConstant.DORIC_BRIDGE_RESOLVE,
                        params)
                .setCallback(new AsyncResult.Callback<JSDecoder>() {
                    @Override
                    public void onResult(JSDecoder result) {

                    }

                    @Override
                    public void onError(Throwable t) {
                        context.getDriver().getRegistry().onException(context, t instanceof Exception ? (Exception) t : new RuntimeException(t));
                    }

                    @Override
                    public void onFinish() {

                    }
                });
    }

    public void reject(JavaValue... javaValue) {
        Object[] params = new Object[javaValue.length + 2];
        params[0] = context.getContextId();
        params[1] = callbackId;
        System.arraycopy(javaValue, 0, params, 2, javaValue.length);
        context.getDriver()
                .invokeDoricMethod(
                        DoricConstant.DORIC_BRIDGE_REJECT,
                        params)
                .setCallback(new AsyncResult.Callback<JSDecoder>() {
                    @Override
                    public void onResult(JSDecoder result) {

                    }

                    @Override
                    public void onError(Throwable t) {
                        context.getDriver().getRegistry().onException(context, t instanceof Exception ? (Exception) t : new RuntimeException(t));
                    }

                    @Override
                    public void onFinish() {

                    }
                });
    }
}
