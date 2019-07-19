package com.github.pengfeizhou.doric.bridge;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.extension.DoricComponent;
import com.github.pengfeizhou.doric.extension.DoricMethod;

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

    @DoricMethod(name = "toast")
    public void toast() {
        
    }
}
