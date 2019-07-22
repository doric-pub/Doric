package com.github.penfeizhou.doric.shader;

import android.widget.FrameLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;

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
    public FrameLayout build(JSObject jsObject) {
        return new FrameLayout(getContext());
    }
}
