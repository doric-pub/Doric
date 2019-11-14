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

import android.graphics.drawable.ShapeDrawable;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import pub.doric.DoricContext;
import pub.doric.utils.DoricUtils;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-23
 */
public class LinearNode extends GroupNode<LinearLayout> {
    public LinearNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject layoutConfig) {
        super.blendSubLayoutConfig(viewNode, layoutConfig);
        JSValue jsValue = layoutConfig.getProperty("alignment");
        if (jsValue.isNumber()) {
            ((LinearLayout.LayoutParams) viewNode.getLayoutParams()).gravity = jsValue.asNumber().toInt();
        }
        JSValue weight = layoutConfig.getProperty("weight");
        if (weight.isNumber()) {
            ((LinearLayout.LayoutParams) viewNode.getLayoutParams()).weight = weight.asNumber().toInt();
        }
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new LinearLayout.LayoutParams(0, 0);
    }

    @Override
    protected LinearLayout build() {
        return new LinearLayout(getContext());
    }

    @Override
    protected void blend(LinearLayout view, ViewGroup.LayoutParams params, String name, JSValue prop) {
        switch (name) {
            case "space":
                ShapeDrawable shapeDrawable;
                if (view.getDividerDrawable() == null) {
                    shapeDrawable = new ShapeDrawable();
                    shapeDrawable.setAlpha(0);
                    view.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                } else {
                    shapeDrawable = (ShapeDrawable) view.getDividerDrawable();
                    view.setDividerDrawable(null);
                }
                if (view.getOrientation() == LinearLayout.VERTICAL) {
                    shapeDrawable.setIntrinsicHeight(DoricUtils.dp2px(prop.asNumber().toFloat()));
                } else {
                    shapeDrawable.setIntrinsicWidth(DoricUtils.dp2px(prop.asNumber().toFloat()));
                }
                view.setDividerDrawable(shapeDrawable);
                break;
            case "gravity":
                view.setGravity(prop.asNumber().toInt());
                break;
            default:
                super.blend(view, params, name, prop);
                break;
        }
    }
}
