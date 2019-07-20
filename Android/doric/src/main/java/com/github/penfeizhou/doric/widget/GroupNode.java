package com.github.penfeizhou.doric.widget;

import android.util.SparseArray;
import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class GroupNode extends ViewNode<ViewGroup> {
    private Map<String, ViewNode> mChildrenNode = new HashMap<>();
    private SparseArray<ViewNode> mIndexInfo = new SparseArray<>();

    public GroupNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        JSArray jsArray = jsObject.getProperty("children").asArray();
        int i;
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
                child.ids.addAll(this.ids);
                child.ids.add(id);
                mChildrenNode.put(id, child);
                mView.addView(child.mView, i);
            } else if (i != child.index) {
                mIndexInfo.remove(child.index);
                child.index = i;
                mView.removeView(child.mView);
                mView.addView(child.mView, i);
            }
            child.blend(childObj.getProperty("props").asObject());
            mIndexInfo.put(i, child);
        }
        while (i < mView.getChildCount()) {
            mView.removeViewAt(mView.getChildCount() - 1);
            if (mIndexInfo.get(i) != null) {
                mChildrenNode.remove(mIndexInfo.get(i).getId());
                mIndexInfo.remove(i);
            }
        }
    }
}
