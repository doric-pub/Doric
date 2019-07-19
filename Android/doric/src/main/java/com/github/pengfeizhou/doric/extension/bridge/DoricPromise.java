package com.github.pengfeizhou.doric.extension.bridge;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.utils.DoricConstant;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: com.github.pengfeizhou.doric.extension.bridge
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-19
 */
public class DoricPromise {
    private final DoricContext context;
    private final String callbackId;

    public DoricPromise(DoricContext context, String callbackId) {
        this.context = context;
        this.callbackId = callbackId;
    }

    public void resolve(JavaValue... javaValue) {
        context.getDriver().invokeDoricMethod(
                DoricConstant.DORIC_BRIDGE_RESOLVE,
                context.getContextId(),
                callbackId,
                javaValue);
    }

    public void reject(JavaValue... javaValue) {
        context.getDriver().invokeDoricMethod(
                DoricConstant.DORIC_BRIDGE_REJECT,
                context.getContextId(),
                callbackId,
                javaValue);
    }
}
