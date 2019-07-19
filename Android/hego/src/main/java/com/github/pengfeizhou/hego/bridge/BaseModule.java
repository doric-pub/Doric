package com.github.pengfeizhou.hego.bridge;

import com.github.pengfeizhou.hego.HegoContext;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public abstract class BaseModule {
    private final HegoContext hegoContext;

    protected BaseModule(HegoContext hegoContext) {
        this.hegoContext = hegoContext;
    }

    public abstract String moduleName();
}
