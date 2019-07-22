package com.github.penfeizhou.doric.shader;

import android.widget.TextView;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Text")
public class TextNode extends ViewNode<TextView> {
    public TextNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public TextView build(JSObject jsObject) {
        return new TextView(getContext());
    }

    @Override
    protected void blend(TextView view, String name, JSValue prop) {
        switch (name) {
            case "text":
                view.setText(prop.asString().toString());
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
