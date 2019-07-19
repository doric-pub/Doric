package com.github.pengfeizhou.doric.plugin;

import com.github.pengfeizhou.doric.DoricContext;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public abstract class DoricNativePlugin {
    private final DoricContext doricContext;

    protected DoricNativePlugin(DoricContext doricContext) {
        this.doricContext = doricContext;
    }

    public DoricContext getDoricContext() {
        return doricContext;
    }
}
