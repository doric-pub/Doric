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

import android.view.ViewGroup;
import android.widget.FrameLayout;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Stack")
public class StackNode extends GroupNode<FrameLayout> {
    public StackNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject jsObject) {
        super.blendSubLayoutConfig(viewNode, jsObject);
        JSValue jsValue = jsObject.getProperty("alignment");
        if (jsValue.isNumber()) {
            ((FrameLayout.LayoutParams) viewNode.getLayoutParams()).gravity = jsValue.asNumber().toInt();
        }
    }

    @Override
    protected FrameLayout build() {
        return new FrameLayout(getContext());
    }

    @Override
    protected void blend(FrameLayout view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        switch (name) {
            case "gravity":
                view.setForegroundGravity(prop.asNumber().toInt());
                break;
            default:
                super.blend(view, layoutParams, name, prop);
        }
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new FrameLayout.LayoutParams(0, 0);
    }
}
