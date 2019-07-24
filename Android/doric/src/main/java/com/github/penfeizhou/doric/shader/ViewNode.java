package com.github.penfeizhou.doric.shader;

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
import com.github.pengfeizhou.jscore.JSValue;

import java.util.ArrayList;

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

    void blend(JSObject jsObject) {
        if (mView == null) {
            mView = build(jsObject);
        }
        if (mView.getLayoutParams() == null) {
            mView.setLayoutParams(new ViewGroup.MarginLayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT));
        }
        for (String prop : jsObject.propertySet()) {
            blend(mView, prop, jsObject.getProperty(prop));
        }
        mView.setLayoutParams(mView.getLayoutParams());
    }

    protected void blend(T view, String name, JSValue prop) {
        switch (name) {
            case "width":
                if (prop.asNumber().toInt() < 0) {
                    view.getLayoutParams().width = prop.asNumber().toInt();
                } else {
                    view.getLayoutParams().width = DoricUtils.dp2px(prop.asNumber().toFloat());
                }
                break;
            case "height":
                if (prop.asNumber().toInt() < 0) {
                    view.getLayoutParams().height = prop.asNumber().toInt();
                } else {
                    view.getLayoutParams().height = DoricUtils.dp2px(prop.asNumber().toFloat());
                }
                break;
            case "x":
                if (view.getLayoutParams() instanceof ViewGroup.MarginLayoutParams) {
                    float x = prop.asNumber().toFloat();
                    ((ViewGroup.MarginLayoutParams) mView.getLayoutParams()).leftMargin = DoricUtils.dp2px(x);
                }
                break;
            case "y":
                if (view.getLayoutParams() instanceof ViewGroup.MarginLayoutParams) {
                    float y = prop.asNumber().toFloat();
                    ((ViewGroup.MarginLayoutParams) mView.getLayoutParams()).topMargin = DoricUtils.dp2px(y);
                }
                break;
            case "bgColor":
                view.setBackgroundColor(prop.asNumber().toInt());
                break;
            case "onClick":
                final String functionId = prop.asString().value();
                view.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        callJSResponse(functionId);
                    }
                });
                break;
            default:
                break;
        }
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

    public void callJSResponse(String funcId, Object... args) {
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
