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
@DoricPlugin(name = "VLayout")
public class VLayoutNode extends LinearNode {
    public VLayoutNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public LinearLayout build(JSObject jsObject) {
        LinearLayout linearLayout = super.build(jsObject);
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        return linearLayout;
    }

}
