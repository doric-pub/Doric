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

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.text.TextUtils;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.RootNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricLog;
import pub.doric.utils.ThreadMode;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-29
 */
@DoricPlugin(name = "animate")
public class AnimatePlugin extends DoricJavaPlugin {
    public AnimatePlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void submit(DoricPromise promise) {
        promise.resolve();
    }

    @DoricMethod
    public void animateRender(final JSObject jsObject, final DoricPromise promise) {
        getDoricContext().getDriver().asyncCall(new Callable<Object>() {
            @Override
            public Object call() {
                final long duration = jsObject.getProperty("duration").asNumber().toLong();
                AnimatorSet animatorSet = new AnimatorSet();
                getDoricContext().setAnimatorSet(animatorSet);
                String viewId = jsObject.getProperty("id").asString().value();
                RootNode rootNode = getDoricContext().getRootNode();
                if (TextUtils.isEmpty(rootNode.getId())) {
                    rootNode.setId(viewId);
                    rootNode.blend(jsObject.getProperty("props").asObject());
                } else {
                    ViewNode<?> viewNode = getDoricContext().targetViewNode(viewId);
                    if (viewNode != null) {
                        viewNode.blend(jsObject.getProperty("props").asObject());
                    }
                }
                getDoricContext().setAnimatorSet(null);
                animatorSet.setDuration(duration);
                animatorSet.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        promise.resolve();
                    }
                });
                animatorSet.start();
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
                promise.reject(new JavaValue(t.getLocalizedMessage()));
            }

            @Override
            public void onFinish() {
            }
        });
    }
}
