package com.github.penfeizhou.doric.shader;

import android.widget.LinearLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-23
 */
@DoricPlugin(name = "HLayout")
public class HLayoutNode extends LinearNode {
    public HLayoutNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public LinearLayout build(JSObject jsObject) {
        LinearLayout linearLayout = super.build(jsObject);
        linearLayout.setOrientation(LinearLayout.HORIZONTAL);
        return linearLayout;
    }
}
