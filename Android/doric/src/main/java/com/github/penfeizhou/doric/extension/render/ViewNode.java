package com.github.penfeizhou.doric.extension.render;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.utils.DoricComponent;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: Render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class ViewNode<T extends View> extends DoricComponent {
    public ViewNode(DoricContext doricContext) {
        super(doricContext);
    }

    public abstract T build(JSObject jsObject);

    public Context getContext() {
        return getDoricContext().getContext();
    }

    public void config(T view, JSObject jsObject) {
        setFrame(view.getLayoutParams(), jsObject);
    }

    public void setFrame(ViewGroup.LayoutParams layoutParams, JSObject jsObject) {
        float width = jsObject.getProperty("width").asNumber().toFloat();
        float height = jsObject.getProperty("height").asNumber().toFloat();
        layoutParams.width = DoricUtils.dp2px(width);
        layoutParams.height = DoricUtils.dp2px(height);
        if (layoutParams instanceof ViewGroup.MarginLayoutParams) {
            float x = jsObject.getProperty("x").asNumber().toFloat();
            float y = jsObject.getProperty("y").asNumber().toFloat();
            ((ViewGroup.MarginLayoutParams) layoutParams).leftMargin = DoricUtils.dp2px(x);
            ((ViewGroup.MarginLayoutParams) layoutParams).topMargin = DoricUtils.dp2px(y);
        }
    }
}
