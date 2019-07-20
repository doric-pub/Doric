package com.github.penfeizhou.doric;

import android.text.TextUtils;

import com.github.penfeizhou.doric.extension.bridge.DoricPluginInfo;
import com.github.penfeizhou.doric.plugin.DoricJavaPlugin;
import com.github.penfeizhou.doric.plugin.ModalPlugin;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Description: com.github.penfeizhou.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public class DoricRegistry {
    private static Map<String, String> bundles = new ConcurrentHashMap<>();
    private Map<String, DoricPluginInfo> pluginInfoMap = new HashMap<>();
    private static Set<DoricLibrary> doricLibraries = new HashSet<>();

    private static void initRegistry(DoricRegistry doricRegistry) {
        for (DoricLibrary library : doricLibraries) {
            library.load(doricRegistry);
        }
    }


    public static void register(DoricLibrary doricLibrary) {
        doricLibraries.add(doricLibrary);
    }

    public DoricRegistry() {
        this.registerNativePlugin(ModalPlugin.class);
        initRegistry(this);
    }

    public void registerJSBundle(String name, String bundle) {
        bundles.put(name, bundle);
    }

    public void registerNativePlugin(Class<? extends DoricJavaPlugin> pluginClass) {
        DoricPluginInfo doricPluginInfo = new DoricPluginInfo(pluginClass);
        if (!TextUtils.isEmpty(doricPluginInfo.getName())) {
            pluginInfoMap.put(doricPluginInfo.getName(), doricPluginInfo);
        }
    }

    public DoricPluginInfo acquirePluginInfo(String name) {
        return pluginInfoMap.get(name);
    }

    public String acquireJSBundle(String name) {
        return bundles.get(name);
    }
}
