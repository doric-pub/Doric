package com.github.pengfeizhou.hego.bridge;

import com.github.pengfeizhou.hego.HegoContext;
import com.github.pengfeizhou.hego.extension.HegoMethod;

/**
 * @Description: Hego
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class ModalModule extends BaseModule {

    protected ModalModule(HegoContext hegoContext) {
        super(hegoContext);
    }

    @Override
    public String moduleName() {
        return "modal";
    }

    @HegoMethod(name = "toast")
    public void toast() {

    }
}
