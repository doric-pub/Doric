package pub.doric.utils;

import android.text.TextUtils;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricMetaInfo<T extends DoricContextHolder> {

    private Constructor<? extends T> pluginConstructor;

    private Map<String, Method> methodMap = new ConcurrentHashMap<>();
    private String name;

    public DoricMetaInfo(Class<? extends T> pluginClass) {
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

    public T createInstance(DoricContext doricContext) {
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
