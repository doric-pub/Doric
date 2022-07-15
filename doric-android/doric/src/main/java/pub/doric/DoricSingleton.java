/*
 * Copyright [2021] [Doric.Pub]
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

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import pub.doric.loader.DoricJSLoaderManager;

/**
 * @Description: pub.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/21
 */
public class DoricSingleton {

    final Map<String, String> bundles = new ConcurrentHashMap<>();
    public final Set<DoricLibrary> libraries = new HashSet<>();
    public final List<WeakReference<DoricRegistry>> registries = new ArrayList<>();
    final Map<String, Object> envMap = new ConcurrentHashMap<>();

    private final DoricJSLoaderManager jsLoaderManager = new DoricJSLoaderManager();

    boolean enablePerformance = false;

    boolean enableRenderSnapshot = false;
    private DoricNativeDriver nativeDriver;
    private final DoricContextManager doricContextManager = new DoricContextManager();
    public boolean legacyMode = false;

    private static class Inner {
        private static final DoricSingleton sInstance = new DoricSingleton();
    }

    private DoricSingleton() {
    }

    public static DoricSingleton getInstance() {
        return Inner.sInstance;
    }


    public void registerLibrary(DoricLibrary doricLibrary) {
        libraries.add(doricLibrary);
        for (WeakReference<DoricRegistry> registryWeakReference : registries) {
            DoricRegistry registry = registryWeakReference.get();
            if (registry != null) {
                doricLibrary.load(registry);
            }
        }
    }

    public void setEnvironmentValue(Map<String, Object> value) {
        envMap.putAll(value);
        for (WeakReference<DoricRegistry> registryWeakReference : registries) {
            DoricRegistry registry = registryWeakReference.get();
            if (registry != null) {
                registry.innerSetEnvironmentValue(value);
            }
        }
    }

    public DoricJSLoaderManager getJSLoaderManager() {
        return jsLoaderManager;
    }

    public DoricNativeDriver getNativeDriver() {
        if (nativeDriver == null) {
            nativeDriver = new DoricNativeDriver();
        }
        return nativeDriver;
    }

    public DoricContextManager getContextManager() {
        return doricContextManager;
    }
}
