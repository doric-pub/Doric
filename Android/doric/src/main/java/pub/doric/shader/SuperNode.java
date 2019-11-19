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

import android.view.View;
import android.view.ViewGroup;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.HashMap;
import java.util.Map;

import pub.doric.DoricContext;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-13
 */
public abstract class SuperNode<V extends View> extends ViewNode<V> {
    private Map<String, JSObject> subNodes = new HashMap<>();
    protected boolean mReusable = false;

    public SuperNode(DoricContext doricContext) {
        super(doricContext);
    }

    public abstract ViewNode getSubNodeById(String id);

    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new ViewGroup.LayoutParams(0, 0);
    }

    @Override
    protected void blend(V view, String name, JSValue prop) {
        if (name.equals("subviews")) {
            if (prop.isArray()) {
                JSArray subviews = prop.asArray();
                for (int i = 0; i < subviews.size(); i++) {
                    JSObject subNode = subviews.get(i).asObject();
                    mixinSubNode(subNode);
                    blendSubNode(subNode);
                }
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    private void mixinSubNode(JSObject subNode) {
        String id = subNode.getProperty("id").asString().value();
        JSObject targetNode = subNodes.get(id);
        if (targetNode == null) {
            subNodes.put(id, subNode);
        } else {
            mixin(subNode, targetNode);
        }
    }

    public JSObject getSubModel(String id) {
        return subNodes.get(id);
    }

    public void setSubModel(String id, JSObject model) {
        subNodes.put(id, model);
    }

    public void clearSubModel() {
        subNodes.clear();
    }

    protected abstract void blendSubNode(JSObject subProperties);

    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject jsObject) {
        JSValue margin = jsObject.getProperty("margin");
        JSValue widthSpec = jsObject.getProperty("widthSpec");
        JSValue heightSpec = jsObject.getProperty("heightSpec");
        ViewGroup.LayoutParams layoutParams = viewNode.getLayoutParams();
        if (widthSpec.isNumber()) {
            switch (widthSpec.asNumber().toInt()) {
                case 1:
                    layoutParams.width = ViewGroup.LayoutParams.WRAP_CONTENT;
                    break;
                case 2:
                    layoutParams.width = ViewGroup.LayoutParams.MATCH_PARENT;
                    break;
                default:
                    break;
            }
        }
        if (heightSpec.isNumber()) {
            switch (heightSpec.asNumber().toInt()) {
                case 1:
                    layoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;
                    break;
                case 2:
                    layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    break;
                default:
                    break;
            }
        }
        if (margin.isObject() && layoutParams instanceof ViewGroup.MarginLayoutParams) {
            JSValue topVal = margin.asObject().getProperty("top");
            if (topVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).topMargin = DoricUtils.dp2px(topVal.asNumber().toFloat());
            }
            JSValue leftVal = margin.asObject().getProperty("left");
            if (leftVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).leftMargin = DoricUtils.dp2px(leftVal.asNumber().toFloat());
            }
            JSValue rightVal = margin.asObject().getProperty("right");
            if (rightVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).rightMargin = DoricUtils.dp2px(rightVal.asNumber().toFloat());
            }
            JSValue bottomVal = margin.asObject().getProperty("bottom");
            if (bottomVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).bottomMargin = DoricUtils.dp2px(bottomVal.asNumber().toFloat());
            }
        }
    }

    private void mixin(JSObject src, JSObject target) {
        JSObject srcProps = src.getProperty("props").asObject();
        JSObject targetProps = target.getProperty("props").asObject();
        for (String key : srcProps.propertySet()) {
            JSValue jsValue = srcProps.getProperty(key);
            if ("subviews".equals(key) && jsValue.isArray()) {
                continue;
            }
            targetProps.asObject().setProperty(key, jsValue);
        }
    }

    private boolean viewIdIsEqual(JSObject src, JSObject target) {
        String srcId = src.asObject().getProperty("id").asString().value();
        String targetId = target.asObject().getProperty("id").asString().value();
        return srcId.equals(targetId);
    }

    protected void recursiveMixin(JSObject src, JSObject target) {
        JSObject srcProps = src.getProperty("props").asObject();
        JSObject targetProps = target.getProperty("props").asObject();
        for (String key : srcProps.propertySet()) {
            JSValue jsValue = srcProps.getProperty(key);
            if ("subviews".equals(key) && jsValue.isArray()) {
                JSValue[] subviews = jsValue.asArray().toArray();
                for (JSValue subview : subviews) {
                    JSValue oriSubviews = targetProps.getProperty("subviews");
                    if (oriSubviews.isArray()) {
                        for (JSValue targetSubview : oriSubviews.asArray().toArray()) {
                            if (viewIdIsEqual(subview.asObject(), targetSubview.asObject())) {
                                recursiveMixin(subview.asObject(), targetSubview.asObject());
                                break;
                            }
                        }
                    }
                }
                continue;
            }
            targetProps.asObject().setProperty(key, jsValue);
        }
    }
}
