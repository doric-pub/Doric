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

import android.util.SparseArray;
import android.view.ViewGroup;

import pub.doric.DoricContext;
import pub.doric.utils.DoricUtils;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class GroupNode<F extends ViewGroup> extends ViewNode<F> {
    private Map<String, ViewNode> mChildrenNode = new HashMap<>();
    private SparseArray<ViewNode> mIndexInfo = new SparseArray<>();

    public GroupNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blend(F view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        super.blend(view, layoutParams, name, prop);
        switch (name) {
            case "children":
                JSArray jsArray = prop.asArray();
                int i;
                List<ViewNode> tobeRemoved = new ArrayList<>();
                for (i = 0; i < jsArray.size(); i++) {
                    JSValue jsValue = jsArray.get(i);
                    if (!jsValue.isObject()) {
                        continue;
                    }
                    JSObject childObj = jsValue.asObject();
                    String type = childObj.getProperty("type").asString().value();
                    String id = childObj.getProperty("id").asString().value();
                    ViewNode child = mChildrenNode.get(id);
                    if (child == null) {
                        child = ViewNode.create(getDoricContext(), type);
                        child.index = i;
                        child.mParent = this;
                        child.mId = id;
                        mChildrenNode.put(id, child);
                    } else {
                        if (i != child.index) {
                            mIndexInfo.remove(i);
                            child.index = i;
                            mView.removeView(child.getView());
                        }
                        tobeRemoved.remove(child);
                    }

                    ViewNode node = mIndexInfo.get(i);

                    if (node != null && node != child) {
                        mView.removeViewAt(i);
                        mIndexInfo.remove(i);
                        tobeRemoved.add(node);
                    }

                    ViewGroup.LayoutParams params = child.getLayoutParams();
                    if (params == null) {
                        params = generateDefaultLayoutParams();
                    }
                    child.blend(childObj.getProperty("props").asObject(), params);
                    if (mIndexInfo.get(i) == null) {
                        mView.addView(child.getView(), i, child.getLayoutParams());
                        mIndexInfo.put(i, child);
                    }
                }
                int count = mView.getChildCount();
                while (i < count) {
                    ViewNode node = mIndexInfo.get(i);
                    if (node != null) {
                        mChildrenNode.remove(node.getId());
                        mIndexInfo.remove(i);
                        tobeRemoved.remove(node);
                        mView.removeView(node.getView());
                    }
                    i++;
                }

                for (ViewNode node : tobeRemoved) {
                    mChildrenNode.remove(node.getId());
                }
                break;
            default:
                super.blend(view, layoutParams, name, prop);
                break;
        }
    }

    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new ViewGroup.LayoutParams(0, 0);
    }

    protected void blendChild(ViewNode viewNode, JSObject jsObject) {


        JSValue jsValue = jsObject.getProperty("margin");
        JSValue widthSpec = jsObject.getProperty("widthSpec");
        JSValue heightSpec = jsObject.getProperty("widthSpec");

        ViewGroup.LayoutParams layoutParams = viewNode.getLayoutParams();
        if (widthSpec.isNumber()) {
            switch (widthSpec.asNumber().toInt()) {
                case 1:
                    layoutParams.width = ViewGroup.LayoutParams.WRAP_CONTENT;
                    break;
                case 2:
                    layoutParams.width = ViewGroup.LayoutParams.MATCH_PARENT;
                    break;
                default:
                    break;

            }
        }
        if (heightSpec.isNumber()) {
            switch (heightSpec.asNumber().toInt()) {
                case 1:
                    layoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;
                    break;
                case 2:
                    layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    break;
                default:
                    break;
            }
        }
        if (jsValue.isObject() && layoutParams instanceof ViewGroup.MarginLayoutParams) {
            JSValue topVal = jsValue.asObject().getProperty("top");
            if (topVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).topMargin = DoricUtils.dp2px(topVal.asNumber().toFloat());
            }
            JSValue leftVal = jsValue.asObject().getProperty("left");
            if (leftVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).leftMargin = DoricUtils.dp2px(leftVal.asNumber().toFloat());
            }
            JSValue rightVal = jsValue.asObject().getProperty("right");
            if (rightVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).rightMargin = DoricUtils.dp2px(rightVal.asNumber().toFloat());
            }
            JSValue bottomVal = jsValue.asObject().getProperty("bottom");
            if (bottomVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).bottomMargin = DoricUtils.dp2px(bottomVal.asNumber().toFloat());
            }
        }
    }
}
