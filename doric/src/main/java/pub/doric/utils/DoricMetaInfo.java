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
