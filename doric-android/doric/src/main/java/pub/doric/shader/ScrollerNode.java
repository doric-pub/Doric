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


import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.widget.HVScrollView2;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-18
 */
@DoricPlugin(name = "Scroller")
public class ScrollerNode extends SuperNode<HVScrollView2> {
    private String mChildViewId;
    private ViewNode mChildNode;

    public ScrollerNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public ViewNode getSubNodeById(String id) {
        return id.equals(mChildNode.getId()) ? mChildNode : null;
    }

    @Override
    protected void blendSubNode(JSObject subProperties) {
        if (mChildNode != null) {
            mChildNode.blend(subProperties.getProperty("props").asObject());
        }
    }

    @Override
    protected HVScrollView2 build() {
        return new HVScrollView2(getContext());
    }

    @Override
    protected void blend(HVScrollView2 view, String name, JSValue prop) {
        if ("content".equals(name)) {
            mChildViewId = prop.asString().value();
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        JSObject contentModel = getSubModel(mChildViewId);
        if (contentModel == null) {
            return;
        }
        String viewId = contentModel.getProperty("id").asString().value();
        String type = contentModel.getProperty("type").asString().value();
        JSObject props = contentModel.getProperty("props").asObject();
        if (mChildNode != null) {
            if (mChildNode.getId().equals(viewId)) {
                //skip
            } else {
                if (mReusable && type.equals(mChildNode.getType())) {
                    mChildNode.setId(viewId);
                    mChildNode.blend(props);
                } else {
                    mView.removeAllViews();
                    mChildNode = ViewNode.create(getDoricContext(), type);
                    mChildNode.setId(viewId);
                    mChildNode.init(this);
                    mChildNode.blend(props);
                    mView.addView(mChildNode.getNodeView());
                }
            }
        } else {
            mChildNode = ViewNode.create(getDoricContext(), type);
            mChildNode.setId(viewId);
            mChildNode.init(this);
            mChildNode.blend(props);
            mView.addView(mChildNode.getNodeView());
        }
    }

}
