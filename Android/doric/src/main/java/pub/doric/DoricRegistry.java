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

import android.text.TextUtils;

import pub.doric.plugin.NavigatorPlugin;
import pub.doric.plugin.NetworkPlugin;
import pub.doric.plugin.ShaderPlugin;
import pub.doric.plugin.StoragePlugin;
import pub.doric.shader.HLayoutNode;
import pub.doric.shader.ImageNode;
import pub.doric.shader.ScrollerNode;
import pub.doric.shader.list.ListItemNode;
import pub.doric.shader.list.ListNode;
import pub.doric.shader.RootNode;
import pub.doric.shader.StackNode;
import pub.doric.shader.TextNode;
import pub.doric.shader.VLayoutNode;
import pub.doric.shader.ViewNode;
import pub.doric.shader.slider.SlideItemNode;
import pub.doric.shader.slider.SliderNode;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.plugin.ModalPlugin;

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
        this.registerNativePlugin(NetworkPlugin.class);
        this.registerNativePlugin(StoragePlugin.class);
        this.registerNativePlugin(NavigatorPlugin.class);
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
