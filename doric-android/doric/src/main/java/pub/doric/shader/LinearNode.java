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
import android.graphics.drawable.ShapeDrawable;
import android.view.ViewGroup;

import androidx.appcompat.widget.DoricLinearLayoutCompat;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.utils.DoricUtils;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-23
 */
public class LinearNode extends GroupNode<DoricLinearLayoutCompat> {

    private static class MaximumLinearLayout extends DoricLinearLayoutCompat {
        private int maxWidth = Integer.MAX_VALUE;
        private int maxHeight = Integer.MAX_VALUE;


        public MaximumLinearLayout(Context context) {
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

        @Override
        protected void onLayout(boolean changed, int l, int t, int r, int b) {
            super.onLayout(changed, l, t, r, b);
        }
    }

    public LinearNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blendLayoutConfig(JSObject jsObject) {
        super.blendLayoutConfig(jsObject);
        JSValue maxWidth = jsObject.getProperty("maxWidth");
        if (maxWidth.isNumber()) {
            ((MaximumLinearLayout) mView).maxWidth = DoricUtils.dp2px(maxWidth.asNumber().toFloat());
        }
        JSValue maxHeight = jsObject.getProperty("maxHeight");
        if (maxHeight.isNumber()) {
            ((MaximumLinearLayout) mView).maxHeight = DoricUtils.dp2px(maxHeight.asNumber().toFloat());
        }
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode<?> viewNode, JSObject layoutConfig) {
        super.blendSubLayoutConfig(viewNode, layoutConfig);
        JSValue jsValue = layoutConfig.getProperty("alignment");
        if (jsValue.isNumber()) {
            ((DoricLinearLayoutCompat.LayoutParams) viewNode.getLayoutParams()).gravity = jsValue.asNumber().toInt();
        }
        JSValue weight = layoutConfig.getProperty("weight");
        if (weight.isNumber()) {
            ((DoricLinearLayoutCompat.LayoutParams) viewNode.getLayoutParams()).weight = weight.asNumber().toInt();
        }
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new DoricLinearLayoutCompat.LayoutParams(0, 0);
    }

    @Override
    protected DoricLinearLayoutCompat build() {
        DoricLinearLayoutCompat linearLayout = new MaximumLinearLayout(getContext());
        linearLayout.setBaselineAligned(false);
        return linearLayout;
    }

    @Override
    protected void blend(DoricLinearLayoutCompat view, String name, JSValue prop) {
        switch (name) {
            case "space":
                if (!prop.isNumber()) {
                    return;
                }
                ShapeDrawable shapeDrawable;
                if (view.getDividerDrawable() == null) {
                    shapeDrawable = new ShapeDrawable();
                    shapeDrawable.setAlpha(0);
                    view.setShowDividers(DoricLinearLayoutCompat.SHOW_DIVIDER_MIDDLE);
                } else {
                    shapeDrawable = (ShapeDrawable) view.getDividerDrawable();
                    view.setDividerDrawable(null);
                }
                if (view.getOrientation() == DoricLinearLayoutCompat.VERTICAL) {
                    shapeDrawable.setIntrinsicHeight(DoricUtils.dp2px(prop.asNumber().toFloat()));
                } else {
                    shapeDrawable.setIntrinsicWidth(DoricUtils.dp2px(prop.asNumber().toFloat()));
                }
                view.setDividerDrawable(shapeDrawable);
                break;
            case "gravity":
                if (!prop.isNumber()) {
                    return;
                }
                view.setGravity(prop.asNumber().toInt());
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
