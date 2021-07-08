/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric;

import android.graphics.drawable.Drawable;
import android.text.TextUtils;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import pub.doric.engine.DoricJSEngine;
import pub.doric.plugin.AnimatePlugin;
import pub.doric.plugin.CoordinatorPlugin;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.plugin.KeyboardPlugin;
import pub.doric.plugin.ModalPlugin;
import pub.doric.plugin.NavBarPlugin;
import pub.doric.plugin.NavigatorPlugin;
import pub.doric.plugin.NetworkPlugin;
import pub.doric.plugin.NotchPlugin;
import pub.doric.plugin.NotificationPlugin;
import pub.doric.plugin.PopoverPlugin;
import pub.doric.plugin.ShaderPlugin;
import pub.doric.plugin.StatusBarPlugin;
import pub.doric.plugin.StoragePlugin;
import pub.doric.refresh.RefreshableNode;
import pub.doric.shader.DraggableNode;
import pub.doric.shader.HLayoutNode;
import pub.doric.shader.ImageNode;
import pub.doric.shader.InputNode;
import pub.doric.shader.RootNode;
import pub.doric.shader.ScrollerNode;
import pub.doric.shader.StackNode;
import pub.doric.shader.SwitchNode;
import pub.doric.shader.TextNode;
import pub.doric.shader.VLayoutNode;
import pub.doric.shader.ViewNode;
import pub.doric.shader.flex.FlexNode;
import pub.doric.shader.flowlayout.FlowLayoutItemNode;
import pub.doric.shader.flowlayout.FlowLayoutNode;
import pub.doric.shader.list.ListItemNode;
import pub.doric.shader.list.ListNode;
import pub.doric.shader.slider.NestedSliderNode;
import pub.doric.shader.slider.SlideItemNode;
import pub.doric.shader.slider.SliderNode;
import pub.doric.utils.DoricMetaInfo;

/**
 * @Description: pub.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public class DoricRegistry {
    private static final Map<String, String> bundles = new ConcurrentHashMap<>();
    private static final Set<DoricLibrary> doricLibraries = new HashSet<>();
    private static final List<WeakReference<DoricRegistry>> registries = new ArrayList<>();
    private static final Map<String, Object> envMap = new ConcurrentHashMap<>();
    private final Map<String, DoricMetaInfo<DoricJavaPlugin>> pluginInfoMap = new HashMap<>();
    private final Map<String, DoricMetaInfo<ViewNode>> nodeInfoMap = new HashMap<>();

    private final Set<IDoricMonitor> monitors = new HashSet<>();

    private Drawable defaultPlaceHolderDrawable = null;

    private Drawable defaultErrorDrawable = null;

    private static boolean enablePerformance = false;

    public static void enablePerformance(boolean enable) {
        enablePerformance = enable;
    }

    public static boolean isEnablePerformance() {
        return enablePerformance;
    }

    private static void initRegistry(DoricRegistry doricRegistry) {
        for (DoricLibrary library : doricLibraries) {
            library.load(doricRegistry);
        }
    }

    public static void register(DoricLibrary doricLibrary) {
        doricLibraries.add(doricLibrary);
        for (WeakReference<DoricRegistry> registryWeakReference : registries) {
            DoricRegistry registry = registryWeakReference.get();
            if (registry != null) {
                doricLibrary.load(registry);
            }
        }
    }

    public static void setEnvironmentValue(Map<String, Object> value) {
        envMap.putAll(value);
        for (WeakReference<DoricRegistry> registryWeakReference : registries) {
            DoricRegistry registry = registryWeakReference.get();
            if (registry != null) {
                registry.innerSetEnvironmentValue(value);
            }
        }
    }

    private final WeakReference<DoricJSEngine> doricJSEngineWeakReference;

    public DoricRegistry(DoricJSEngine doricJSEngine) {
        doricJSEngineWeakReference = new WeakReference<>(doricJSEngine);
        this.registerNativePlugin(ShaderPlugin.class);
        this.registerNativePlugin(ModalPlugin.class);
        this.registerNativePlugin(NetworkPlugin.class);
        this.registerNativePlugin(StoragePlugin.class);
        this.registerNativePlugin(NavigatorPlugin.class);
        this.registerNativePlugin(NavBarPlugin.class);
        this.registerNativePlugin(PopoverPlugin.class);
        this.registerNativePlugin(AnimatePlugin.class);
        this.registerNativePlugin(NotificationPlugin.class);
        this.registerNativePlugin(StatusBarPlugin.class);
        this.registerNativePlugin(CoordinatorPlugin.class);
        this.registerNativePlugin(NotchPlugin.class);
        this.registerNativePlugin(KeyboardPlugin.class);

        this.registerViewNode(RootNode.class);
        this.registerViewNode(TextNode.class);
        this.registerViewNode(ImageNode.class);
        this.registerViewNode(StackNode.class);
        this.registerViewNode(VLayoutNode.class);
        this.registerViewNode(HLayoutNode.class);
        this.registerViewNode(ListNode.class);
        this.registerViewNode(ListItemNode.class);
        this.registerViewNode(ScrollerNode.class);
        this.registerViewNode(SliderNode.class);
        this.registerViewNode(SlideItemNode.class);
        this.registerViewNode(RefreshableNode.class);
        this.registerViewNode(FlowLayoutNode.class);
        this.registerViewNode(FlowLayoutItemNode.class);
        this.registerViewNode(InputNode.class);
        this.registerViewNode(NestedSliderNode.class);
        this.registerViewNode(DraggableNode.class);
        this.registerViewNode(SwitchNode.class);
        this.registerViewNode(FlexNode.class);
        initRegistry(this);
        doricJSEngine.setEnvironmentValue(envMap);
        registries.add(new WeakReference<>(this));
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

    private void innerSetEnvironmentValue(Map<String, Object> value) {
        DoricJSEngine doricJSEngine = doricJSEngineWeakReference.get();
        if (doricJSEngine == null) {
            return;
        }
        doricJSEngine.setEnvironmentValue(value);
    }

    public void registerMonitor(IDoricMonitor monitor) {
        this.monitors.add(monitor);
    }

    public void onException(DoricContext context, Exception e) {
        for (IDoricMonitor monitor : this.monitors) {
            monitor.onException(context, e);
        }
    }

    public void onLog(int type, String message) {
        for (IDoricMonitor monitor : this.monitors) {
            monitor.onLog(type, message);
        }
    }

    public Drawable getDefaultPlaceHolderDrawable() {
        return defaultPlaceHolderDrawable;
    }

    /**
     * @param defaultPlaceHolderDrawable Default display when image is loading and not set by JS API
     */
    public void setDefaultPlaceHolderDrawable(Drawable defaultPlaceHolderDrawable) {
        this.defaultPlaceHolderDrawable = defaultPlaceHolderDrawable;
    }

    public Drawable getDefaultErrorDrawable() {
        return defaultErrorDrawable;
    }

    /**
     * @param defaultErrorDrawable Default display when image load error and not set by JS API
     */
    public void setDefaultErrorDrawable(Drawable defaultErrorDrawable) {
        this.defaultErrorDrawable = defaultErrorDrawable;
    }
}
