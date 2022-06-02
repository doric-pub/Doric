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
package pub.doric.shader.slider;

import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.StackNode;
import pub.doric.shader.SuperNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
@DoricPlugin(name = "SlideItem")
public class SlideItemNode extends StackNode {
    public String identifier = "";

    public SlideItemNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public void init(SuperNode<?> superNode) {
        super.init(superNode);
        mReusable = true;
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("identifier".equals(name)) {
            this.identifier = prop.asString().value();
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        getNodeView().getLayoutParams().width = ViewGroup.LayoutParams.MATCH_PARENT;
        getNodeView().getLayoutParams().height = ViewGroup.LayoutParams.MATCH_PARENT;
    }
}
