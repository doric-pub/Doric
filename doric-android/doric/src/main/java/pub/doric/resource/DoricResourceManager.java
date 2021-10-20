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

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import pub.doric.DoricContext;

/**
 * @Description: This manages all resource loaders
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public class DoricResourceManager {
    private final Map<String, DoricResourceLoader> mResourceLoaders = new HashMap<>();

    public void registerLoader(DoricResourceLoader loader) {
        mResourceLoaders.put(loader.resourceType(), loader);
    }

    public void unRegisterLoader(DoricResourceLoader loader) {
        mResourceLoaders.remove(loader.resourceType());
    }

    @Nullable
    public DoricResource load(@NonNull DoricContext doricContext, @NonNull String type, @NonNull String identifier) {
        DoricResourceLoader loader = mResourceLoaders.get(type);
        if (loader != null) {
            return loader.load(doricContext, identifier);
        }
        return null;
    }
}
