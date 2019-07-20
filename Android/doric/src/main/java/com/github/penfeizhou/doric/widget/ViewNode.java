package com.github.penfeizhou.doric.widget;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.DoricRegistry;
import com.github.penfeizhou.doric.utils.DoricComponent;
import com.github.penfeizhou.doric.utils.DoricConstant;
import com.github.penfeizhou.doric.utils.DoricMetaInfo;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSObject;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @Description: Render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class ViewNode<T extends View> extends DoricComponent {
    protected T mView;
    int index;

    ArrayList<String> ids = new ArrayList<>();

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

    public String getId() {
        return ids.get(ids.size() - 1);
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

    public void callJSRespone(String funcId, Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = ids.toArray(new String[0]);
        nArgs[1] = funcId;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        getDoricContext().callEntity(DoricConstant.DORIC_ENTITY_RESPONSE, nArgs);
    }

    public static ViewNode create(DoricContext doricContext, String type) {
        DoricRegistry registry = doricContext.getDriver().getRegistry();
        DoricMetaInfo<ViewNode> clz = registry.acquireViewNodeInfo(type);
        return clz.createInstance(doricContext);
    }
}
