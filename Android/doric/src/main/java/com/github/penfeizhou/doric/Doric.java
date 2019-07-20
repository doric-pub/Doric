package com.github.penfeizhou.doric;

import android.app.Application;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class Doric {
    private static Application sApplication;

    public static void init(Application application) {
        sApplication = application;
    }

    public static Application application() {
        return sApplication;
    }

    private static Map<String, String> bundles = new ConcurrentHashMap<>();

    public static void registerJSBundle(String name, String bundle) {
        bundles.put(name, bundle);
    }

    public static String getJSBundle(String name) {
        return bundles.get(name);
    }
}
