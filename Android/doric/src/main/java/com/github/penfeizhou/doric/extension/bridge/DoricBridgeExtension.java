package com.github.penfeizhou.doric.extension.bridge;

import android.text.TextUtils;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.plugin.DoricNativePlugin;
import com.github.penfeizhou.doric.plugin.ModalPlugin;
import com.github.penfeizhou.doric.DoricContextManager;
import com.github.penfeizhou.doric.utils.DoricLog;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricBridgeExtension {
    private Map<String, DoricPluginInfo> pluginInfoMap = new HashMap<>();

    public DoricBridgeExtension() {
        registerExtension(ModalPlugin.class);
    }

    public void registerExtension(Class<? extends DoricNativePlugin> pluginClass) {
        DoricPluginInfo doricPluginInfo = new DoricPluginInfo(pluginClass);
        if (!TextUtils.isEmpty(doricPluginInfo.getName())) {
            pluginInfoMap.put(doricPluginInfo.getName(), doricPluginInfo);
        }
    }

    public JavaValue callNative(String contextId, String module, String methodName, String callbackId, JSDecoder jsDecoder) {
        DoricContext context = DoricContextManager.getContext(contextId);
        DoricPluginInfo pluginInfo = pluginInfoMap.get(module);
        if (pluginInfo == null) {
            DoricLog.e("Cannot find plugin class:%s", module);
            return new JavaValue(false);
        }
        DoricNativePlugin doricNativePlugin = context.obtainPlugin(pluginInfo);
        if (doricNativePlugin == null) {
            DoricLog.e("Cannot obtain plugin instance:%s,method:%", module);
            return new JavaValue(false);
        }
        Method method = pluginInfo.getMethod(methodName);
        if (method == null) {
            DoricLog.e("Cannot find plugin method in class:%s,method:%s", module, methodName);
            return new JavaValue(false);
        }
        DoricMethod doricMethod = method.getAnnotation(DoricMethod.class);
        try {
            Class[] classes = method.getParameterTypes();
            Object ret;
            if (classes.length == 0) {
                ret = method.invoke(doricNativePlugin);
            } else if (classes.length == 1) {
                ret = method.invoke(doricNativePlugin, createParam(context, classes[0], callbackId, jsDecoder));
            } else {
                ret = method.invoke(doricNativePlugin,
                        createParam(context, classes[0], callbackId, jsDecoder),
                        createParam(context, classes[1], callbackId, jsDecoder));
            }
            return DoricUtils.toJavaValue(ret);
        } catch (Exception e) {
            DoricLog.e("callNative error:%s", e.getLocalizedMessage());
            return new JavaValue(false);
        }
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
