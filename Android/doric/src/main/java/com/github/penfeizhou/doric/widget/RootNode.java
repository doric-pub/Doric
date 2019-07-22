package com.github.penfeizhou.doric.widget;

import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Root")
public class RootNode extends GroupNode<FrameLayout> {
    public RootNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public FrameLayout build(JSObject jsObject) {
        return new FrameLayout(getContext());
    }

    public void setRootView(FrameLayout rootView) {
        this.mView = rootView;
    }
}
