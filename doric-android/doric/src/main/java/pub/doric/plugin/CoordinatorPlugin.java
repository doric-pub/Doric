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

import android.graphics.Color;
import android.view.View;

import com.github.pengfeizhou.jscore.JSNumber;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.DoricScrollChangeListener;
import pub.doric.IDoricScrollable;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2020-02-13
 */
@DoricPlugin(name = "coordinator")
public class CoordinatorPlugin extends DoricJavaPlugin {
    public CoordinatorPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void ready(final DoricPromise doricPromise) {
        getDoricContext().getDriver().asyncCall(new Callable<Object>() {
            @Override
            public Object call() {
                doricPromise.resolve();
                return null;
            }
        }, ThreadMode.UI);
    }


    @DoricMethod(thread = ThreadMode.UI)
    public void verticalScrolling(final JSObject argument, final DoricPromise doricPromise) {
        getDoricContext().getDriver().asyncCall(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                JSValue[] scrollableIds = argument.getProperty("scrollable").asArray().toArray();
                ViewNode<?> scrollNode = null;
                for (JSValue value : scrollableIds) {
                    if (scrollNode == null) {
                        scrollNode = getDoricContext().targetViewNode(value.asString().value());
                    } else {
                        if (value.isString() && scrollNode instanceof SuperNode) {
                            String viewId = value.asString().value();
                            scrollNode = ((SuperNode<?>) scrollNode).getSubNodeById(viewId);
                        }
                    }
                }
                if (scrollNode == null) {
                    throw new Exception("Cannot find scrollable view");
                }
                JSObject scrollRange = argument.getProperty("scrollRange").asObject();
                final int startAnchor = DoricUtils.dp2px(scrollRange.getProperty("start").asNumber().toFloat());
                final int endAnchor = DoricUtils.dp2px(scrollRange.getProperty("end").asNumber().toFloat());

                JSValue target = argument.getProperty("target");
                boolean isNavBar = false;
                ViewNode<?> targetNode = null;
                if (target.isString() && "NavBar".equals(target.asString().value())) {
                    isNavBar = true;
                } else if (target.isArray()) {
                    JSValue[] targetIds = target.asArray().toArray();
                    for (JSValue value : targetIds) {
                        if (targetNode == null) {
                            targetNode = getDoricContext().targetViewNode(value.asString().value());
                        } else {
                            if (value.isString() && targetNode instanceof SuperNode) {
                                String viewId = value.asString().value();
                                targetNode = ((SuperNode<?>) targetNode).getSubNodeById(viewId);
                            }
                        }
                    }
                } else {
                    throw new Exception("Target type error");
                }
                JSObject changing = argument.getProperty("changing").asObject();
                final String name = changing.getProperty("name").asString().value();
                final float changingStart = changing.getProperty("start").asNumber().toFloat();
                final float changingEnd = changing.getProperty("end").asNumber().toFloat();


                final ViewNode<?> finalScrollNode = scrollNode;
                final ViewNode<?> finalTargetNode = targetNode;
                final boolean finalIsNavBar = isNavBar;

                if (finalScrollNode instanceof IDoricScrollable) {
                    ((IDoricScrollable) finalScrollNode).addScrollChangeListener(new DoricScrollChangeListener() {
                        @Override
                        public void onScrollChange(View v, int scrollX, int scrollY, int oldScrollX, int oldScrollY) {
                            if (scrollY <= startAnchor) {
                                setValue(finalTargetNode, finalIsNavBar, name, changingStart);
                            } else if (scrollY >= endAnchor) {
                                setValue(finalTargetNode, finalIsNavBar, name, changingEnd);
                            } else {
                                float range = Math.max(1, endAnchor - startAnchor);
                                float offset = scrollY - startAnchor;
                                float rate = offset / range;
                                float value;
                                if ("backgroundColor".equals(name)) {
                                    int startColor = (int) changingStart;
                                    int endColor = (int) changingEnd;
                                    value = Color.argb((int) (Color.alpha(startColor) + (Color.alpha(endColor) - Color.alpha(startColor)) * rate),
                                            (int) (Color.red(startColor) + (Color.red(endColor) - Color.red(startColor)) * rate),
                                            (int) (Color.green(startColor) + (Color.green(endColor) - Color.green(startColor)) * rate),
                                            (int) (Color.blue(startColor) + (Color.blue(endColor) - Color.blue(startColor)) * rate));
                                } else {
                                    value = changingStart + (changingEnd - changingStart) * rate;
                                }
                                setValue(finalTargetNode, finalIsNavBar, name, value);
                            }
                        }
                    });
                    return null;
                } else {
                    throw new Exception("Scroller type error");
                }
            }
        }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
            @Override
            public void onResult(Object result) {
                doricPromise.resolve();
            }

            @Override
            public void onError(Throwable t) {
                doricPromise.reject();
            }

            @Override
            public void onFinish() {

            }
        });
    }

    private void setValue(ViewNode<?> viewNode, boolean isNavBar, String name, float value) {
        if ("backgroundColor".equals(name) && isNavBar) {
            getDoricContext().getDoricNavBar().setBackgroundColor((int) value);
        } else {
            JSNumber jsNumber = new JSNumber(value);
            JSObject jsObject = new JSObject();
            jsObject.setProperty(name, jsNumber);
            viewNode.blend(jsObject);
        }
    }
}
