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
package pub.doric.shader.flex;

import android.view.ViewGroup;

import com.facebook.yoga.android.YogaLayout;
import com.github.pengfeizhou.jscore.JSObject;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.GroupNode;
import pub.doric.shader.ViewNode;

/**
 * @Description: FlexBox Node
 * @Author: pengfei.zhou
 * @CreateDate: 2020-04-09
 */
@DoricPlugin(name = "FlexLayout")
public class FlexNode extends GroupNode<YogaLayout> {
    public FlexNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected YogaLayout build() {
        return new YogaLayout(getContext());
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new YogaLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject jsObject) {
        super.blendSubLayoutConfig(viewNode, jsObject);
    }
}
