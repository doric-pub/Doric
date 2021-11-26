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

import android.graphics.Rect;
import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.utils.DoricUtils;

/**
 * @Description: Describe the effect view
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/24
 */
@DoricPlugin(name = "AeroEffect")
public class AeroEffectViewNode extends StackNode {
    public AeroEffectViewNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected FrameLayout build() {
        return new AeroEffectView(getContext());
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("effectiveRect".equals(name)) {
            if (prop.isObject()) {
                int x = DoricUtils.dp2px(prop.asObject().getProperty("x").asNumber().toFloat());
                int y = DoricUtils.dp2px(prop.asObject().getProperty("x").asNumber().toFloat());
                int width = DoricUtils.dp2px(prop.asObject().getProperty("width").asNumber().toFloat());
                int height = DoricUtils.dp2px(prop.asObject().getProperty("height").asNumber().toFloat());
                ((AeroEffectView) view).setEffectiveRect(new Rect(x, y, x + width, y + height));
            }
        } else if ("style".equals(name)) {
            if (prop.isString()) {
                ((AeroEffectView) view).setStyle(prop.asString().value());
            } else {
                ((AeroEffectView) view).setStyle(null);
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    protected void blendSubNode(JSObject subProp) {
        super.blendSubNode(subProp);
        mView.invalidate();
    }
}
