package com.github.penfeizhou.doric.shader;

import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Stack")
public class StackNode extends GroupNode<FrameLayout> {
    public StackNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public void blendChild(ViewNode viewNode, JSObject jsObject) {
        JSValue jsValue = jsObject.getProperty("alignment");
        if (jsValue.isNumber()) {
            ((FrameLayout.LayoutParams) viewNode.getLayoutParams()).gravity = jsValue.asNumber().toInt();
        }
    }

    @Override
    public FrameLayout build(JSObject jsObject) {
        return new FrameLayout(getContext());
    }

    @Override
    protected void blend(FrameLayout view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        switch (name) {
            case "gravity":
                view.setForegroundGravity(prop.asNumber().toInt());
                break;
            default:
                super.blend(view, layoutParams, name, prop);
        }
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    }
}
