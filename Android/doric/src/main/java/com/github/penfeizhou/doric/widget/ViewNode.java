package com.github.penfeizhou.doric.widget;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.DoricRegistry;
import com.github.penfeizhou.doric.utils.DoricComponent;
import com.github.penfeizhou.doric.utils.DoricMetaInfo;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: Render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class ViewNode<T extends View> extends DoricComponent {
    protected T mView;
    String id;

    int index;

    public ViewNode(DoricContext doricContext) {
        super(doricContext);
    }

    public T getView() {
        return mView;
    }

    public Context getContext() {
        return getDoricContext().getContext();
    }

    public abstract T build(JSObject jsObject);

    public void blend(JSObject jsObject) {
        if (mView == null) {
            mView = build(jsObject);
        }
        setFrame(mView.getLayoutParams(), jsObject);
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

    public static ViewNode create(DoricContext doricContext, String id, String type) {
        DoricRegistry registry = doricContext.getDriver().getRegistry();
        DoricMetaInfo<ViewNode> clz = registry.acquireViewNodeInfo(type);
        ViewNode node = clz.createInstance(doricContext);
        node.id = id;
        return node;
    }
}
