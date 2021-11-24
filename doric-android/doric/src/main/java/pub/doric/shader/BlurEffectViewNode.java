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
package pub.doric.shader;

import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

/**
 * @Description: Describe the effect view
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/24
 */
@DoricPlugin(name = "BlurEffect")
public class BlurEffectViewNode extends StackNode {
    public BlurEffectViewNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected FrameLayout build() {
        return new BlurEffectView(getContext());
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("radius".equals(name)) {
            if (prop.isNumber()) {
                ((BlurEffectView) view).setRadius(prop.asNumber().toInt());
            }
        } else {
            super.blend(view, name, prop);
        }
    }
}
