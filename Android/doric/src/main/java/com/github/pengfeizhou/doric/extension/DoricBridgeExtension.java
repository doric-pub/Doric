package com.github.pengfeizhou.doric.extension;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.DoricDriver;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricBridgeExtension {
    public DoricBridgeExtension() {

    }

    public JavaValue callNative(String contextId, String module, String method, String callbackId, JSDecoder jsDecoder) {
        DoricContext doricContext = DoricDriver.getInstance().getContext(contextId);


        return null;
    }
}
