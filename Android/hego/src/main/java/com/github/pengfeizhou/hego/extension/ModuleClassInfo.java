package com.github.pengfeizhou.hego.extension;

import android.text.TextUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description: Android
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
                HegoMethod hegoMethod = method.getAnnotation(HegoMethod.class);
                if (hegoMethod != null) {
                    if (TextUtils.isEmpty(hegoMethod.name())) {
                        methodMap.put(method.getName(), method);
                    } else {
                        methodMap.put(hegoMethod.name(), method);
                    }
                }
            }
        }
    }
}
