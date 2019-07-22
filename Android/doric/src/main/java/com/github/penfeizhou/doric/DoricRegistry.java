package com.github.penfeizhou.doric;

import android.text.TextUtils;

import com.github.penfeizhou.doric.plugin.ShaderPlugin;
import com.github.penfeizhou.doric.widget.ViewNode;
import com.github.penfeizhou.doric.utils.DoricMetaInfo;
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
    private Map<String, DoricMetaInfo<DoricJavaPlugin>> pluginInfoMap = new HashMap<>();
    private Map<String, DoricMetaInfo<ViewNode>> nodeInfoMap = new HashMap<>();
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
        this.registerNativePlugin(ShaderPlugin.class);
        this.registerNativePlugin(ModalPlugin.class);
        initRegistry(this);
    }

    public void registerJSBundle(String name, String bundle) {
        bundles.put(name, bundle);
    }

    public void registerNativePlugin(Class<? extends DoricJavaPlugin> pluginClass) {
        DoricMetaInfo<DoricJavaPlugin> doricMetaInfo = new DoricMetaInfo<>(pluginClass);
        if (!TextUtils.isEmpty(doricMetaInfo.getName())) {
            pluginInfoMap.put(doricMetaInfo.getName(), doricMetaInfo);
        }
    }

    public DoricMetaInfo<DoricJavaPlugin> acquirePluginInfo(String name) {
        return pluginInfoMap.get(name);
    }

    public void registerViewNode(Class<? extends ViewNode> pluginClass) {
        DoricMetaInfo<ViewNode> doricMetaInfo = new DoricMetaInfo<>(pluginClass);
        if (!TextUtils.isEmpty(doricMetaInfo.getName())) {
            nodeInfoMap.put(doricMetaInfo.getName(), doricMetaInfo);
        }
    }

    public DoricMetaInfo<ViewNode> acquireViewNodeInfo(String name) {
        return nodeInfoMap.get(name);
    }

    public String acquireJSBundle(String name) {
        return bundles.get(name);
    }
}
