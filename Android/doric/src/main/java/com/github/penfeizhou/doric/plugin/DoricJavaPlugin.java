package com.github.penfeizhou.doric.plugin;

import com.github.penfeizhou.doric.DoricContext;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public abstract class DoricJavaPlugin {
    private final DoricContext doricContext;

    public DoricJavaPlugin(DoricContext doricContext) {
        this.doricContext = doricContext;
    }

    public DoricContext getDoricContext() {
        return doricContext;
    }
}
