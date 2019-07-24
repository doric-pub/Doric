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
@DoricPlugin(name = "Root")
public class RootNode extends StackNode {
    public RootNode(DoricContext doricContext) {
        super(doricContext);
    }

    public void setRootView(FrameLayout rootView) {
        this.mView = rootView;
    }

    public void render(JSObject props) {
        blend(props, mView.getLayoutParams());
    }
}
