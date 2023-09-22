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
package pub.doric.resource;

import com.github.pengfeizhou.jscore.JSArrayBuffer;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.UiThread;
import pub.doric.DoricContext;

/**
 * @Description: This manages all resource loaders
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public class DoricResourceManager {
    private final Map<String, DoricResourceLoader> mResourceLoaders = new HashMap<>();

    public synchronized void registerLoader(DoricResourceLoader loader) {
        mResourceLoaders.put(loader.resourceType(), loader);
    }

    public synchronized void unRegisterLoader(DoricResourceLoader loader) {
        mResourceLoaders.remove(loader.resourceType());
    }

    @Nullable
    @UiThread
    public synchronized DoricResource load(@NonNull DoricContext doricContext,
                                           @NonNull JSObject resource) {
        String resId = resource.getProperty("resId").asString().value();
        String type = resource.getProperty("type").asString().value();
        String identifier = resource.getProperty("identifier").asString().value();
        DoricResource doricResource = doricContext.getCachedResource(resId);
        if (doricResource == null) {
            DoricResourceLoader loader = mResourceLoaders.get(type);
            if (loader != null) {
                doricResource = loader.load(doricContext, identifier);
                if (doricResource instanceof DoricArrayBufferResource) {
                    JSArrayBuffer buffer = resource.getProperty("data").asArrayBuffer();
                    ((DoricArrayBufferResource) doricResource).setValue(buffer);
                } else if (doricResource instanceof DoricRemoteResource) {
                    JSValue headers = resource.getProperty("headers");
                    if (headers.isObject()) {
                        JSObject headersObject = headers.asObject();
                        for (Map.Entry<String, JSValue> entry : headersObject.value().entrySet()) {
                            ((DoricRemoteResource) doricResource).setHeader(entry.getKey(),
                                    entry.getValue().asString().value());
                        }
                    }
                }
                doricContext.cacheResource(resId, doricResource);
            }
        }
        return doricResource;
    }
}
