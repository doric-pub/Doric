/*
 * Copyright [2022] [Doric.Pub]
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
package pub.doric.shader.horizontallist;

import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.StackNode;
import pub.doric.shader.SuperNode;

/**
 * @Description: pub.doric.shader.horizontallist
 * @Author: jingpeng.wang
 * @CreateDate: 2022-8-22
 */
@DoricPlugin(name = "HorizontalListItem")
public class HorizontalListItemNode extends StackNode {
    public String identifier = "";

    public HorizontalListItemNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public void init(SuperNode<?> superNode) {
        super.init(superNode);
        this.mReusable = true;
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("actions".equals(name)) {
        } else if ("identifier".equals(name)) {
            this.identifier = prop.asString().value();
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        getNodeView().getLayoutParams().width = getLayoutParams().width;
        getNodeView().getLayoutParams().height = getLayoutParams().height;
    }
}
