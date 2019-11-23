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

import pub.doric.async.AsyncResult;
import pub.doric.utils.DoricUtils;

/**
 * @Description: handle "assets://asset-file-path"
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
public class DoricAssetJSLoader implements IDoricJSLoader {
    @Override
    public boolean filter(String scheme) {
        return scheme.startsWith("assets");
    }

    @Override
    public AsyncResult<String> request(String scheme) {
        return new AsyncResult<>(DoricUtils.readAssetFile(scheme.substring("assets://".length())));
    }
}
