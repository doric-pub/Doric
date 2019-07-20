package com.github.penfeizhou.doric.extension.bridge;

import android.text.TextUtils;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.DoricRegistry;
import com.github.penfeizhou.doric.async.AsyncResult;
import com.github.penfeizhou.doric.plugin.DoricJavaPlugin;
import com.github.penfeizhou.doric.plugin.ModalPlugin;
import com.github.penfeizhou.doric.DoricContextManager;
import com.github.penfeizhou.doric.utils.DoricLog;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricBridgeExtension {

    private final DoricRegistry mRegistry;

    public DoricBridgeExtension(DoricRegistry doricRegistry) {
        mRegistry = doricRegistry;
    }

    public JavaValue callNative(String contextId, String module, String methodName, final String callbackId, final JSDecoder jsDecoder) {
        final DoricContext context = DoricContextManager.getContext(contextId);
        DoricPluginInfo pluginInfo = mRegistry.acquirePluginInfo(module);
        if (pluginInfo == null) {
            DoricLog.e("Cannot find plugin class:%s", module);
            return new JavaValue(false);
        }
        final DoricJavaPlugin doricJavaPlugin = context.obtainPlugin(pluginInfo);
        if (doricJavaPlugin == null) {
            DoricLog.e("Cannot obtain plugin instance:%s,method:%", module);
            return new JavaValue(false);
        }
        final Method method = pluginInfo.getMethod(methodName);
        if (method == null) {
            DoricLog.e("Cannot find plugin method in class:%s,method:%s", module, methodName);
            return new JavaValue(false);
        }
        DoricMethod doricMethod = method.getAnnotation(DoricMethod.class);
        Callable<JavaValue> callable = new Callable<JavaValue>() {
            @Override
            public JavaValue call() throws Exception {
                Class[] classes = method.getParameterTypes();
                Object ret;
                if (classes.length == 0) {
                    ret = method.invoke(doricJavaPlugin);
                } else if (classes.length == 1) {
                    ret = method.invoke(doricJavaPlugin, createParam(context, classes[0], callbackId, jsDecoder));
                } else {
                    ret = method.invoke(doricJavaPlugin,
                            createParam(context, classes[0], callbackId, jsDecoder),
                            createParam(context, classes[1], callbackId, jsDecoder));
                }
                return DoricUtils.toJavaValue(ret);
            }
        };
        AsyncResult<JavaValue> asyncResult = context.getDriver().asyncCall(callable, doricMethod.thread());
        if (asyncResult.hasResult()) {
            return asyncResult.getResult();
        }
        return new JavaValue(true);
    }

    private Object createParam(DoricContext context, Class clz, String callbackId, JSDecoder jsDecoder) {
        if (clz == DoricPromise.class) {
            return new DoricPromise(context, callbackId);
        } else {
            try {
                return DoricUtils.toJavaObject(clz, jsDecoder);
            } catch (Exception e) {
                DoricLog.e("createParam error:%s", e.getLocalizedMessage());
            }
            return null;
        }
    }
}
