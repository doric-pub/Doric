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
package pub.doric.shader;

import android.content.Context;
import android.text.TextUtils;
import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.DoricScrollChangeListener;
import pub.doric.IDoricScrollable;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.utils.DoricJSDispatcher;
import pub.doric.utils.DoricUtils;
import pub.doric.widget.HVScrollView;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-18
 */
@DoricPlugin(name = "Scroller")
public class ScrollerNode extends SuperNode<HVScrollView> implements IDoricScrollable {
    private String mChildViewId;
    private ViewNode mChildNode;
    private Set<DoricScrollChangeListener> listeners = new HashSet<>();
    private String onScrollFuncId;
    private String onScrollEndFuncId;
    private DoricJSDispatcher jsDispatcher = new DoricJSDispatcher();

    private static class MaximumScrollView extends HVScrollView {
        private int maxWidth = Integer.MAX_VALUE;
        private int maxHeight = Integer.MAX_VALUE;


        public MaximumScrollView(Context context) {
            super(context);
        }

        @Override
        protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            int width = getMeasuredWidth();
            int height = getMeasuredHeight();
            if (width > maxWidth || height > maxHeight) {
                width = Math.min(width, maxWidth);
                height = Math.min(height, maxHeight);
                widthMeasureSpec = MeasureSpec.makeMeasureSpec(width, MeasureSpec.AT_MOST);
                heightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.AT_MOST);
                super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            }
        }
    }

    public ScrollerNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blendLayoutConfig(JSObject jsObject) {
        super.blendLayoutConfig(jsObject);
        JSValue maxWidth = jsObject.getProperty("maxWidth");
        if (maxWidth.isNumber()) {
            ((MaximumScrollView) mView).maxWidth = DoricUtils.dp2px(maxWidth.asNumber().toFloat());
        }
        JSValue maxHeight = jsObject.getProperty("maxHeight");
        if (maxHeight.isNumber()) {
            ((MaximumScrollView) mView).maxHeight = DoricUtils.dp2px(maxHeight.asNumber().toFloat());
        }
    }

    @Override
    public ViewNode getSubNodeById(String id) {
        return id.equals(mChildNode.getId()) ? mChildNode : null;
    }

    @Override
    protected void blendSubNode(JSObject subProperties) {
        if (mChildNode != null) {
            mChildNode.blend(subProperties.getProperty("props").asObject());
        }
    }

    @Override
    protected HVScrollView build() {
        HVScrollView hvScrollView = new MaximumScrollView(getContext());
        hvScrollView.setOnScrollChangeListener(new HVScrollView.OnScrollChangeListener() {

            @Override
            public void onScrollChange(HVScrollView v, final int scrollX, final int scrollY, int oldScrollX, int oldScrollY) {
                for (DoricScrollChangeListener listener : listeners) {
                    listener.onScrollChange(v, scrollX, scrollY, oldScrollX, oldScrollY);
                }
                if (!TextUtils.isEmpty(onScrollFuncId)) {
                    if (!TextUtils.isEmpty(onScrollFuncId)) {
                        jsDispatcher.dispatch(new Callable<AsyncResult>() {
                            @Override
                            public AsyncResult call() throws Exception {
                                return callJSResponse(onScrollFuncId, new JSONBuilder()
                                        .put("x", DoricUtils.px2dp(scrollX))
                                        .put("y", DoricUtils.px2dp(scrollY))
                                        .toJSONObject());
                            }
                        });
                    }
                }
            }

            @Override
            public void onScrollEnd(HVScrollView v, int scrollX, int scrollY) {
                if (!TextUtils.isEmpty(onScrollEndFuncId)) {
                    callJSResponse(
                            onScrollEndFuncId,
                            new JSONBuilder()
                                    .put("x", DoricUtils.px2dp(scrollX))
                                    .put("y", DoricUtils.px2dp(scrollY))
                                    .toJSONObject());
                }
            }
        });
        return hvScrollView;
    }

    @Override
    protected void blend(HVScrollView view, String name, JSValue prop) {
        if ("content".equals(name)) {
            if (!prop.isString()) {
                return;
            }
            mChildViewId = prop.asString().value();
        } else if ("onScroll".equals(name)) {
            if (!prop.isString()) {
                return;
            }
            onScrollFuncId = prop.asString().value();
        } else if ("onScrollEnd".equals(name)) {
            if (!prop.isString()) {
                return;
            }
            onScrollEndFuncId = prop.asString().value();
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        JSObject contentModel = getSubModel(mChildViewId);
        if (contentModel == null) {
            return;
        }
        String viewId = contentModel.getProperty("id").asString().value();
        String type = contentModel.getProperty("type").asString().value();
        JSObject props = contentModel.getProperty("props").asObject();
        if (mChildNode != null) {
            if (mChildNode.getId().equals(viewId)) {
                //skip
            } else {
                if (mReusable && type.equals(mChildNode.getType())) {
                    mChildNode.setId(viewId);
                    mChildNode.blend(props);
                } else {
                    mView.removeAllViews();
                    mChildNode = ViewNode.create(getDoricContext(), type);
                    mChildNode.setId(viewId);
                    mChildNode.init(this);
                    mChildNode.blend(props);
                    mView.addView(mChildNode.getNodeView());
                }
            }
        } else {
            mChildNode = ViewNode.create(getDoricContext(), type);
            mChildNode.setId(viewId);
            mChildNode.init(this);
            mChildNode.blend(props);
            mView.addView(mChildNode.getNodeView());
        }
        if (jsObject.getProperty("contentOffset").isObject()) {
            JSObject offset = jsObject.getProperty("contentOffset").asObject();
            mView.scrollTo(DoricUtils.dp2px(offset.getProperty("x").asNumber().toFloat()),
                    DoricUtils.dp2px(offset.getProperty("y").asNumber().toFloat()));
        }
    }

    @Override
    public void addScrollChangeListener(DoricScrollChangeListener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeScrollChangeListener(DoricScrollChangeListener listener) {
        listeners.remove(listener);
    }

    @DoricMethod
    public void scrollTo(JSObject params) {
        boolean animated = false;
        if (params.getProperty("animated").isBoolean()) {
            animated = params.getProperty("animated").asBoolean().value();
        }
        JSObject offset = params.getProperty("offset").asObject();
        if (animated) {
            this.mView.smoothScrollTo(DoricUtils.dp2px(offset.getProperty("x").asNumber().toFloat()),
                    DoricUtils.dp2px(offset.getProperty("y").asNumber().toFloat()));
        } else {
            this.mView.scrollTo(DoricUtils.dp2px(offset.getProperty("x").asNumber().toFloat()),
                    DoricUtils.dp2px(offset.getProperty("y").asNumber().toFloat()));
        }
    }

    @DoricMethod
    public void scrollBy(JSObject params) {
        boolean animated = false;
        if (params.getProperty("animated").isBoolean()) {
            animated = params.getProperty("animated").asBoolean().value();
        }
        JSObject offset = params.getProperty("offset").asObject();
        if (animated) {
            this.mView.smoothScrollBy(DoricUtils.dp2px(offset.getProperty("x").asNumber().toFloat()),
                    DoricUtils.dp2px(offset.getProperty("y").asNumber().toFloat()));
        } else {
            this.mView.scrollBy(DoricUtils.dp2px(offset.getProperty("x").asNumber().toFloat()),
                    DoricUtils.dp2px(offset.getProperty("y").asNumber().toFloat()));
        }
    }
}
