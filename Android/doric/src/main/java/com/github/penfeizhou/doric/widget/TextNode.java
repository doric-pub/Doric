package com.github.penfeizhou.doric.widget;

import android.widget.TextView;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.render.DoricNode;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricNode(name = "Text")
public class TextNode extends ViewNode<TextView> {
    public TextNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public TextView build(JSObject jsObject) {
        return new TextView(getContext());
    }
}
