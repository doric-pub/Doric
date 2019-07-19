package com.github.pengfeizhou.doric.bridge;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.extension.DoricMethod;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class ModalModule extends BaseModule {

    protected ModalModule(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public String moduleName() {
        return "modal";
    }

    @DoricMethod(name = "toast")
    public void toast() {

    }
}
