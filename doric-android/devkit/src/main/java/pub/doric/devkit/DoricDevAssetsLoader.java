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
package pub.doric.devkit;

import pub.doric.DoricContext;
import pub.doric.resource.DoricAssetsLoader;
import pub.doric.resource.DoricAssetsResource;
import pub.doric.resource.DoricResource;

/**
 * @Description: Load assets in dev mode
 * @Author: pengfei.zhou
 * @CreateDate: 2021/12/7
 */
public class DoricDevAssetsLoader extends DoricAssetsLoader {

    @Override
    public DoricResource load(DoricContext doricContext, String identifier) {
        if (DoricDev.getInstance().isInDevMode()) {

        }
        return new DoricAssetsResource(doricContext, "assets/" + identifier);
    }
}
