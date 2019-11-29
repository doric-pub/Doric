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

import android.text.TextUtils;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricLog;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;
import pub.doric.shader.RootNode;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;
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
    public void render(JSDecoder jsDecoder) {
        try {
            final JSObject jsObject = jsDecoder.decode().asObject();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() throws Exception {
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
                    t.printStackTrace();
                    DoricLog.e("Shader.render:error%s", t.getLocalizedMessage());
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            DoricLog.e("Shader.render:error%s", e.getLocalizedMessage());
        }
    }

    @DoricMethod
    public JavaValue command(JSDecoder jsDecoder, final DoricPromise doricPromise) {
        try {
            final JSObject jsObject = jsDecoder.decode().asObject();
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
                    asyncResult.setCallback(new AsyncResult.Callback<JavaValue>() {
                        @Override
                        public void onResult(JavaValue result) {
                            doricPromise.resolve(result);
                        }

                        @Override
                        public void onError(Throwable t) {
                            doricPromise.resolve(new JavaValue(t.getLocalizedMessage()));
                        }

                        @Override
                        public void onFinish() {

                        }
                    });
                }
            }
        } catch (ArchiveException e) {
            e.printStackTrace();
        }
        return new JavaValue(true);
    }


    private Object createParam(Class clz, DoricPromise doricPromise, JSValue jsValue) {
        if (clz == DoricPromise.class) {
            return doricPromise;
        } else {
            return jsValue;
        }
    }
}
