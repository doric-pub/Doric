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

    public SuperNode(DoricContext doricContext) {
        super(doricContext);
    }

    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new ViewGroup.LayoutParams(0, 0);
    }

    @Override
    protected void blend(V view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
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
            super.blend(view, layoutParams, name, prop);
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

    protected abstract void blendSubNode(JSObject subProperties);

    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject jsObject) {
        JSValue jsValue = jsObject.getProperty("margin");
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
        if (jsValue.isObject() && layoutParams instanceof ViewGroup.MarginLayoutParams) {
            JSValue topVal = jsValue.asObject().getProperty("top");
            if (topVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).topMargin = DoricUtils.dp2px(topVal.asNumber().toFloat());
            }
            JSValue leftVal = jsValue.asObject().getProperty("left");
            if (leftVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).leftMargin = DoricUtils.dp2px(leftVal.asNumber().toFloat());
            }
            JSValue rightVal = jsValue.asObject().getProperty("right");
            if (rightVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).rightMargin = DoricUtils.dp2px(rightVal.asNumber().toFloat());
            }
            JSValue bottomVal = jsValue.asObject().getProperty("bottom");
            if (bottomVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).bottomMargin = DoricUtils.dp2px(bottomVal.asNumber().toFloat());
            }
        }
    }

    private void mixin(JSObject src, JSObject target) {
        JSValue srcProps = src.getProperty("props");
        JSValue targetProps = target.getProperty("props");
        if (srcProps.isObject()) {
            if (targetProps.isObject()) {
                for (String key : srcProps.asObject().propertySet()) {
                    JSValue jsValue = srcProps.asObject().getProperty(key);
                    if ("children".equals(key) && jsValue.isArray()) {
                        JSValue targetChildren = targetProps.asObject().getProperty("children");
                        if (targetChildren.isArray() && targetChildren.asArray().size() == jsValue.asArray().size()) {
                            for (int i = 0; i < jsValue.asArray().size(); i++) {
                                JSValue childSrc = jsValue.asArray().get(i);
                                JSValue childTarget = targetChildren.asArray().get(i);
                                if (childSrc.isObject()) {
                                    if (childTarget.isObject()) {
                                        mixin(childSrc.asObject(), childTarget.asObject());
                                    } else {
                                        targetChildren.asArray().put(i, childSrc);
                                    }
                                }
                            }
                        }
                        continue;
                    }
                    targetProps.asObject().setProperty(key, jsValue);
                }
            } else {
                target.setProperty("props", srcProps);
            }
        }
    }

}
