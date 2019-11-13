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

import pub.doric.DoricContext;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-13
 */
public abstract class SuperNode<V extends View> extends ViewNode<V> {
    public SuperNode(DoricContext doricContext) {
        super(doricContext);
    }

    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new ViewGroup.LayoutParams(0, 0);
    }

    @Override
    protected void blend(V view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        if (name.equals("subviews")) {
            JSArray subviews = prop.asArray();
            for (int i = 0; i < subviews.size(); i++) {
                JSObject subProp = subviews.get(i).asObject();
                blendSubNode(subProp);
            }
        } else {
            super.blend(view, layoutParams, name, prop);
        }
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
}
