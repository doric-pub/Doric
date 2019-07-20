package com.github.penfeizhou.doric.extension.bridge;

import android.text.TextUtils;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.plugin.DoricJavaPlugin;
import com.github.penfeizhou.doric.utils.DoricLog;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricPluginInfo {

    private Constructor<? extends DoricJavaPlugin> pluginConstructor;

    private Map<String, Method> methodMap = new ConcurrentHashMap<>();
    private String name;

    public DoricPluginInfo(Class<? extends DoricJavaPlugin> pluginClass) {
        try {
            this.pluginConstructor = pluginClass.getDeclaredConstructor(DoricContext.class);
            DoricPlugin doricPlugin = pluginClass.getAnnotation(DoricPlugin.class);
            this.name = doricPlugin.name();
            Method[] methods = pluginClass.getMethods();
            for (Method method : methods) {
                DoricMethod doricMethod = method.getAnnotation(DoricMethod.class);
                if (doricMethod != null) {
                    if (TextUtils.isEmpty(doricMethod.name())) {
                        methodMap.put(method.getName(), method);
                    } else {
                        methodMap.put(doricMethod.name(), method);
                    }
                }
            }
        } catch (Exception e) {
            DoricLog.e("Error to create doric for " + e.getLocalizedMessage());
        }
    }

    public String getName() {
        return name;
    }

    public DoricJavaPlugin createPlugin(DoricContext doricContext) {
        try {
            return pluginConstructor.newInstance(doricContext);
        } catch (Exception e) {
            DoricLog.e("Error to create doric plugin for " + e.getLocalizedMessage());
            return null;
        }
    }

    public Method getMethod(String name) {
        return methodMap.get(name);
    }
}
