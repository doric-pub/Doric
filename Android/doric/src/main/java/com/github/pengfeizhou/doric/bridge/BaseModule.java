package com.github.pengfeizhou.doric.bridge;

import com.github.pengfeizhou.doric.DoricContext;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public abstract class BaseModule {
    private final DoricContext doricContext;

    protected BaseModule(DoricContext doricContext) {
        this.doricContext = doricContext;
    }

    public abstract String moduleName();
}
