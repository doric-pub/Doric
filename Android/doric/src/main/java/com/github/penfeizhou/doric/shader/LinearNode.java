package com.github.penfeizhou.doric.shader;

import android.graphics.drawable.ShapeDrawable;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.utils.DoricUtils;
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
    public void blendChild(ViewNode viewNode, JSObject layoutConfig) {
        JSValue jsValue = layoutConfig.getProperty("alignment");
        if (jsValue.isNumber()) {
            ((LinearLayout.LayoutParams) viewNode.getLayoutParams()).gravity = jsValue.asNumber().toInt();
        }
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    }

    @Override
    public LinearLayout build(JSObject jsObject) {
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
