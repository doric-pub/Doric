package com.github.penfeizhou.doric.extension.bridge;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.utils.DoricConstant;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: com.github.penfeizhou.doric.extension.bridge
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
        Object[] params = new Object[javaValue.length + 2];
        params[0] = context.getContextId();
        params[1] = callbackId;
        System.arraycopy(javaValue, 0, params, 2, javaValue.length);
        context.getDriver().invokeDoricMethod(
                DoricConstant.DORIC_BRIDGE_RESOLVE,
                params);
    }

    public void reject(JavaValue... javaValue) {
        Object[] params = new Object[javaValue.length + 2];
        params[0] = context.getContextId();
        params[1] = callbackId;
        System.arraycopy(javaValue, 0, params, 2, javaValue.length);
        context.getDriver().invokeDoricMethod(
                DoricConstant.DORIC_BRIDGE_REJECT,
                params);
    }
}
