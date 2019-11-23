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
package pub.doric.plugin;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
@DoricPlugin(name = "navigator")
public class NavigatorPlugin extends DoricJavaPlugin {
    public NavigatorPlugin(DoricContext doricContext) {
        super(doricContext);
    }
}
