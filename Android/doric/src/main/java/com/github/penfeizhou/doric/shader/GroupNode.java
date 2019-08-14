package com.github.penfeizhou.doric.shader;

import android.util.SparseArray;
import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.utils.DoricUtils;
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
        return new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    }

    protected void blendChild(ViewNode viewNode, JSObject jsObject) {
        JSValue jsValue = jsObject.getProperty("margin");
        ViewGroup.LayoutParams layoutParams = viewNode.getLayoutParams();
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
