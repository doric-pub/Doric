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
package pub.doric.shader;

import android.widget.LinearLayout;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-23
 */
@DoricPlugin(name = "VLayout")
public class VLayoutNode extends LinearNode {
    public VLayoutNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected LinearLayout build() {
        LinearLayout linearLayout = super.build();
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        return linearLayout;
    }

}
