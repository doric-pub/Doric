package com.github.penfeizhou.doric.widget;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.render.DoricNode;
import com.github.penfeizhou.doric.render.ViewNode;

/**
 * @Description: widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricNode(name = "Text")
public class TextNode extends ViewNode {
    public TextNode(DoricContext doricContext) {
        super(doricContext);
    }
}
