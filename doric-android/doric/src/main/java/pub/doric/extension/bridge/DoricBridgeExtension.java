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
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.DoricContextManager;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.utils.DoricUtils;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricBridgeExtension {

    public DoricBridgeExtension() {
    }

    public JavaValue callNative(String contextId, String module, String methodName, final String callbackId, final JSDecoder jsDecoder) {
        final DoricContext context = DoricContextManager.getContext(contextId);
        DoricMetaInfo<DoricJavaPlugin> pluginInfo = context.getDriver().getRegistry().acquirePluginInfo(module);
        if (pluginInfo == null) {
            context.getDriver().getRegistry().onLog(
                    Log.ERROR,
                    String.format("Cannot find plugin class:%s", module));
            return new JavaValue(false);
        }
        final DoricJavaPlugin doricJavaPlugin = context.obtainPlugin(pluginInfo);
        if (doricJavaPlugin == null) {
            context.getDriver().getRegistry().onLog(
                    Log.ERROR,
                    String.format("Cannot obtain plugin instance:%s,method:%s", module, methodName));
            return new JavaValue(false);
        }
        final Method method = pluginInfo.getMethod(methodName);
        if (method == null) {
            context.getDriver().getRegistry().onLog(
                    Log.ERROR,
                    String.format("Cannot find plugin method in class:%s,method:%s", module, methodName));
            return new JavaValue(false);
        }
        DoricMethod doricMethod = method.getAnnotation(DoricMethod.class);
        if (doricMethod == null) {
            context.getDriver().getRegistry().onLog(
                    Log.ERROR,
                    String.format("Cannot find DoricMethod annotation in class:%s,method:%s", module, methodName));
            return new JavaValue(false);
        }
        Callable<JavaValue> callable = new Callable<JavaValue>() {
            @Override
            public JavaValue call() throws Exception {
                Class[] classes = method.getParameterTypes();
                Object ret;
                if (classes.length == 0) {
                    ret = method.invoke(doricJavaPlugin);
                } else if (classes.length == 1) {
                    ret = method.invoke(doricJavaPlugin, createParam(context, classes[0], callbackId, jsDecoder));
                } else {
                    ret = method.invoke(doricJavaPlugin,
                            createParam(context, classes[0], callbackId, jsDecoder),
                            createParam(context, classes[1], callbackId, jsDecoder));
                }
                return DoricUtils.toJavaValue(ret);
            }
        };
        AsyncResult<JavaValue> asyncResult = context.getDriver().asyncCall(callable, doricMethod.thread());
        asyncResult.setCallback(new AsyncResult.Callback<JavaValue>() {
            @Override
            public void onResult(JavaValue result) {

            }

            @Override
            public void onError(Throwable t) {
                context.getDriver().getRegistry().onException(
                        context.getSource(),
                        t instanceof Exception ? (Exception) t : new RuntimeException(t));
            }

            @Override
            public void onFinish() {

            }
        });
        if (asyncResult.hasResult()) {
            return asyncResult.getResult();
        }
        return new JavaValue(true);
    }

    private Object createParam(DoricContext context, Class clz, String callbackId, JSDecoder jsDecoder) {
        if (clz == DoricPromise.class) {
            return new DoricPromise(context, callbackId);
        } else {
            try {
                return DoricUtils.toJavaObject(clz, jsDecoder);
            } catch (Exception e) {
                context.getDriver().getRegistry().onException(context.getSource(), e);
                context.getDriver().getRegistry().onLog(
                        Log.ERROR,
                        String.format("createParam error:%s", e.getLocalizedMessage()));
            }
            return null;
        }
    }
}
