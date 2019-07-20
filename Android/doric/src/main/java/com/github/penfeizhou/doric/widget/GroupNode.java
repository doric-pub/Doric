package com.github.penfeizhou.doric.widget;

import android.view.ViewGroup;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.render.ViewNode;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class GroupNode extends ViewNode<ViewGroup> {
    public GroupNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public void config(ViewGroup view, JSObject jsObject) {
        super.config(view, jsObject);
        JSArray jsArray = jsObject.getProperty("children").asArray();
        for (int i = 0; i < jsArray.size(); i++) {
        }
    }
}
