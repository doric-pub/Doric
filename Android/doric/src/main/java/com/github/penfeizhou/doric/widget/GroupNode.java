package com.github.penfeizhou.doric.widget;

import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.render.ViewNode;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class GroupNode extends ViewNode<ViewGroup> {
    private Map<String, ViewNode> mChildren = new HashMap<>();

    public GroupNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        JSArray jsArray = jsObject.getProperty("children").asArray();
        for (int i = 0; i < jsArray.size(); i++) {
            JSObject childObj = jsArray.get(i).asObject();
            String type = childObj.getProperty("type").asString().value();
            String id = childObj.getProperty("id").asString().value();
            ViewNode child = mChildren.get(id);
            if (child == null) {
                child = ViewNode.create(getDoricContext(), id, type);
                mChildren.put(id, child);
            }
            if (getView().getChildAt(i) == null) {
                getView().addView(child.getView());
            }
            child.blend(childObj.getProperty("props").asObject());
        }
    }
}
