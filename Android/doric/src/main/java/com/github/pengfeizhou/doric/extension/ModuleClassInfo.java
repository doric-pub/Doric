package com.github.pengfeizhou.doric.extension;

import android.text.TextUtils;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class ModuleClassInfo {

    private Class clz;

    private Object instance;

    private Map<String, Method> methodMap = new HashMap<>();
    public boolean stringify = false;

    public ModuleClassInfo(Class clz) {
        this.clz = clz;
        try {
            this.instance = clz.newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        Method[] methods = clz.getMethods();
        if (methods != null) {
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
        }
    }
}
