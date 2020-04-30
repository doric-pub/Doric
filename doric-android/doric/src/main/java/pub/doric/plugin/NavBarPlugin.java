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

import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.navbar.IDoricNavBar;
import pub.doric.shader.ViewNode;
import pub.doric.utils.ThreadMode;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-25
 */
@DoricPlugin(name = "navbar")
public class NavBarPlugin extends DoricJavaPlugin {

    private static final String TYPE_LEFT = "navbar_left";
    private static final String TYPE_RIGHT = "navbar_right";
    private static final String TYPE_CENTER = "navbar_center";

    public NavBarPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void isHidden(DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            promise.resolve(new JavaValue(navBar.isHidden()));
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setHidden(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                boolean hidden = jsObject.getProperty("hidden").asBoolean().value();
                navBar.setHidden(hidden);
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setTitle(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                String title = jsObject.getProperty("title").asString().value();
                navBar.setTitle(title);
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setBgColor(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                int color = jsObject.getProperty("color").asNumber().toInt();
                navBar.setBackgroundColor(color);
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setLeft(JSDecoder decoder, final DoricPromise promise) {
        try {
            final JSObject jsObject = decoder.decode().asObject();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() throws Exception {
                    String viewId = jsObject.getProperty("id").asString().value();
                    String type = jsObject.getProperty("type").asString().value();
                    ViewNode node = ViewNode.create(getDoricContext(), type);
                    node.setId(viewId);
                    node.init(new FrameLayout.LayoutParams(0, 0));
                    node.blend(jsObject.getProperty("props").asObject());

                    getDoricContext().getDoricNavBar().setLeft(node.getNodeView());

                    getDoricContext().clearHeadNodes(TYPE_LEFT);
                    getDoricContext().addHeadNode(TYPE_LEFT, node);
                    return null;
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {
                    promise.resolve();
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    promise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setRight(JSDecoder decoder, final DoricPromise promise) {
        try {
            final JSObject jsObject = decoder.decode().asObject();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() throws Exception {
                    String viewId = jsObject.getProperty("id").asString().value();
                    String type = jsObject.getProperty("type").asString().value();
                    ViewNode node = ViewNode.create(getDoricContext(), type);
                    node.setId(viewId);
                    node.init(new FrameLayout.LayoutParams(0, 0));
                    node.blend(jsObject.getProperty("props").asObject());

                    getDoricContext().getDoricNavBar().setRight(node.getNodeView());

                    getDoricContext().clearHeadNodes(TYPE_RIGHT);
                    getDoricContext().addHeadNode(TYPE_RIGHT, node);
                    return null;
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {
                    promise.resolve();
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    promise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setCenter(JSDecoder decoder, final DoricPromise promise) {
        try {
            final JSObject jsObject = decoder.decode().asObject();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() throws Exception {
                    String viewId = jsObject.getProperty("id").asString().value();
                    String type = jsObject.getProperty("type").asString().value();
                    ViewNode node = ViewNode.create(getDoricContext(), type);
                    node.setId(viewId);
                    node.init(new FrameLayout.LayoutParams(0, 0));
                    node.blend(jsObject.getProperty("props").asObject());

                    getDoricContext().getDoricNavBar().setCenter(node.getNodeView());

                    getDoricContext().clearHeadNodes(TYPE_CENTER);
                    getDoricContext().addHeadNode(TYPE_CENTER, node);
                    return null;
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {
                    promise.resolve();
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    promise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }
}
