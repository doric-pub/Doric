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
package pub.doric.plugin;

import android.app.Activity;
import android.os.Build;
import android.os.Looper;
import android.os.MessageQueue;
import android.text.TextUtils;
import android.util.Log;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;
import pub.doric.shader.RootNode;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

/**
 * @Description: com.github.penfeizhou.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-22
 */
@DoricPlugin(name = "shader")
public class ShaderPlugin extends DoricJavaPlugin {
    public ShaderPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void render(final JSObject jsObject, final DoricPromise promise) {
        getDoricContext().getDriver().asyncCall(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                if (getDoricContext().getContext() instanceof Activity) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
                            && ((Activity) getDoricContext().getContext()).isDestroyed()) {
                        return null;
                    }
                }
                String viewId = jsObject.getProperty("id").asString().value();
                RootNode rootNode = getDoricContext().getRootNode();
                if (TextUtils.isEmpty(rootNode.getId())) {
                    rootNode.setId(viewId);
                    rootNode.blend(jsObject.getProperty("props").asObject());
                } else {
                    ViewNode viewNode = getDoricContext().targetViewNode(viewId);
                    if (viewNode != null) {
                        viewNode.blend(jsObject.getProperty("props").asObject());
                    }
                }
                return null;
            }
        }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
            @Override
            public void onResult(Object result) {

            }

            @Override
            public void onError(Throwable t) {
                getDoricContext().getDriver().getRegistry().onException(
                        getDoricContext(),
                        t instanceof Exception ? (Exception) t : new RuntimeException(t));
                getDoricContext().getDriver().getRegistry().onLog(
                        Log.ERROR,
                        String.format("Shader.render:error%s", t.getLocalizedMessage()));
            }

            @Override
            public void onFinish() {
                Looper.myQueue().addIdleHandler(new MessageQueue.IdleHandler() {
                    @Override
                    public boolean queueIdle() {
                        promise.resolve();
                        return false;
                    }
                });
            }
        });
    }

    @DoricMethod
    public void command(final JSObject jsObject, final DoricPromise doricPromise) {
        getDoricContext().getDriver().asyncCall(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                final JSValue[] viewIds = jsObject.getProperty("viewIds").asArray().toArray();
                final String name = jsObject.getProperty("name").asString().value();
                final JSValue args = jsObject.getProperty("args");
                ViewNode viewNode = null;
                for (JSValue value : viewIds) {
                    if (viewNode == null) {
                        viewNode = getDoricContext().targetViewNode(value.asString().value());
                    } else {
                        if (value.isString() && viewNode instanceof SuperNode) {
                            String viewId = value.asString().value();
                            viewNode = ((SuperNode) viewNode).getSubNodeById(viewId);
                        }
                    }
                }
                if (viewNode == null) {
                    doricPromise.reject(new JavaValue("Cannot find opposite view"));
                } else {
                    final ViewNode targetViewNode = viewNode;
                    DoricMetaInfo<ViewNode> pluginInfo = getDoricContext().getDriver().getRegistry()
                            .acquireViewNodeInfo(viewNode.getType());
                    final Method method = pluginInfo.getMethod(name);
                    if (method == null) {
                        String errMsg = String.format(
                                "Cannot find plugin method in class:%s,method:%s",
                                viewNode.getClass(),
                                name);
                        doricPromise.reject(new JavaValue(errMsg));
                    } else {
                        Callable<JavaValue> callable = new Callable<JavaValue>() {
                            @Override
                            public JavaValue call() throws Exception {
                                Class[] classes = method.getParameterTypes();
                                Object ret;
                                if (classes.length == 0) {
                                    ret = method.invoke(targetViewNode);
                                } else if (classes.length == 1) {
                                    ret = method.invoke(targetViewNode,
                                            createParam(classes[0], doricPromise, args));
                                } else {
                                    ret = method.invoke(targetViewNode,
                                            createParam(classes[0], doricPromise, args),
                                            createParam(classes[1], doricPromise, args));
                                }
                                return DoricUtils.toJavaValue(ret);
                            }
                        };
                        AsyncResult<JavaValue> asyncResult = getDoricContext().getDriver()
                                .asyncCall(callable, ThreadMode.UI);
                        if (!method.getReturnType().equals(Void.TYPE)) {
                            asyncResult.setCallback(new AsyncResult.Callback<JavaValue>() {
                                @Override
                                public void onResult(JavaValue result) {
                                    doricPromise.resolve(result);
                                }

                                @Override
                                public void onError(Throwable t) {
                                    doricPromise.resolve(new JavaValue(t.getLocalizedMessage()));
                                    getDoricContext().getDriver().getRegistry().onException(getDoricContext(),
                                            t instanceof Exception ? (Exception) t : new RuntimeException(t));
                                }

                                @Override
                                public void onFinish() {

                                }
                            });
                        }
                    }
                }
                return null;
            }
        }, ThreadMode.UI);

    }


    private Object createParam(Class clz, DoricPromise doricPromise, JSValue jsValue) {
        if (clz == DoricPromise.class) {
            return doricPromise;
        } else {
            try {
                return DoricUtils.toJavaObject(clz, jsValue);
            } catch (Exception e) {
                return jsValue;
            }
        }
    }
}
