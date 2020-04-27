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
package pub.doric.loader;


import android.text.TextUtils;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import pub.doric.async.AsyncResult;

/**
 * @Description: pub.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
public class DoricJSLoaderManager {

    private Set<IDoricJSLoader> jsLoaders = new HashSet<>();

    private DoricJSLoaderManager() {
        addJSLoader(new DoricAssetJSLoader());
        addJSLoader(new DoricHttpJSLoader());
    }

    private static class Inner {
        private static final DoricJSLoaderManager sInstance = new DoricJSLoaderManager();
    }

    public void addJSLoader(IDoricJSLoader jsLoader) {
        jsLoaders.add(jsLoader);
    }

    private Collection<IDoricJSLoader> getJSLoaders() {
        return jsLoaders;
    }

    public static DoricJSLoaderManager getInstance() {
        return Inner.sInstance;
    }

    public AsyncResult<String> loadJSBundle(String source) {
        if (!TextUtils.isEmpty(source)) {
            Collection<IDoricJSLoader> jsLoaders = getJSLoaders();
            for (IDoricJSLoader jsLoader : jsLoaders) {
                if (jsLoader.filter(source)) {
                    return jsLoader.request(source);
                }
            }
        }
        AsyncResult<String> ret = new AsyncResult<>();
        ret.setError(new RuntimeException("Cannot find JS Loader for " + source));
        return ret;
    }

}
