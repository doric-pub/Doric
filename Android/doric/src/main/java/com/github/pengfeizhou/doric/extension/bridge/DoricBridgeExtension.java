package com.github.pengfeizhou.doric.extension.bridge;

import android.text.TextUtils;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.DoricDriver;
import com.github.pengfeizhou.doric.plugin.DoricNativePlugin;
import com.github.pengfeizhou.doric.plugin.ModalPlugin;
import com.github.pengfeizhou.doric.utils.DoricLog;
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
        DoricContext context = DoricDriver.getInstance().getContext(contextId);
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

        Class[] classes = method.getParameterTypes();


        return new JavaValue(true);
    }
}
