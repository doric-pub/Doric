package com.github.penfeizhou.doric.shader;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.DoricRegistry;
import com.github.penfeizhou.doric.utils.DoricComponent;
import com.github.penfeizhou.doric.utils.DoricConstant;
import com.github.penfeizhou.doric.utils.DoricMetaInfo;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.LinkedList;

/**
 * @Description: Render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class ViewNode<T extends View> extends DoricComponent {
    protected T mView;
    int index;
    ViewNode<ViewGroup> mParent;
    String mId;

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

    void blend(JSObject jsObject, ViewGroup.LayoutParams layoutParams) {
        if (mView == null) {
            mView = build(jsObject);
        }
        for (String prop : jsObject.propertySet()) {
            blend(mView, layoutParams, prop, jsObject.getProperty(prop));
        }
        mView.setLayoutParams(layoutParams);
    }

    protected void blend(T view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        switch (name) {
            case "width":
                if (prop.asNumber().toInt() < 0) {
                    layoutParams.width = prop.asNumber().toInt();
                } else {
                    layoutParams.width = DoricUtils.dp2px(prop.asNumber().toFloat());
                }
                break;
            case "height":
                if (prop.asNumber().toInt() < 0) {
                    layoutParams.height = prop.asNumber().toInt();
                } else {
                    layoutParams.height = DoricUtils.dp2px(prop.asNumber().toFloat());
                }
                break;
            case "x":
                if (layoutParams instanceof ViewGroup.MarginLayoutParams) {
                    float x = prop.asNumber().toFloat();
                    ((ViewGroup.MarginLayoutParams) layoutParams).leftMargin = DoricUtils.dp2px(x);
                }
                break;
            case "y":
                if (layoutParams instanceof ViewGroup.MarginLayoutParams) {
                    float y = prop.asNumber().toFloat();
                    ((ViewGroup.MarginLayoutParams) layoutParams).topMargin = DoricUtils.dp2px(y);
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
            case "layoutConfig":
                JSObject layoutConfig = prop.asObject();
                JSValue jsValue = layoutConfig.getProperty("alignment");
                if (jsValue.isNumber()) {
                    if (layoutParams instanceof LinearLayout.LayoutParams) {
                        ((LinearLayout.LayoutParams) layoutParams).gravity = jsValue.asNumber().toInt();
                    } else if (layoutParams instanceof FrameLayout.LayoutParams) {
                        ((FrameLayout.LayoutParams) layoutParams).gravity = jsValue.asNumber().toInt();
                    }
                }
                break;
            default:
                break;
        }
    }

    String[] getIdList() {
        LinkedList<String> ids = new LinkedList<>();
        ViewNode viewNode = this;
        do {
            ids.push(viewNode.mId);
            viewNode = viewNode.mParent;
        } while (viewNode != null && !(viewNode instanceof RootNode));

        return ids.toArray(new String[0]);
    }

    public void callJSResponse(String funcId, Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = getIdList();
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

    public ViewGroup.LayoutParams getLayoutParams() {
        if (mView != null) {
            return mView.getLayoutParams();
        }
        return null;
    }

    public String getId() {
        return mId;
    }
}
