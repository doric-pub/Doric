package com.github.pengfeizhou.doric.plugin;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.extension.bridge.DoricComponent;
import com.github.pengfeizhou.doric.extension.bridge.DoricMethod;
import com.github.pengfeizhou.jscore.JSDecoder;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
@DoricComponent(name = "modal")
public class ModalPlugin extends DoricNativePlugin {

    protected ModalPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(name = "toast", thread = DoricMethod.Mode.UI)
    public void toast(JSDecoder decoder) {

    }
}
