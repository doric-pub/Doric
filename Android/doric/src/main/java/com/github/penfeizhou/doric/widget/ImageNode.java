package com.github.penfeizhou.doric.widget;

import android.widget.ImageView;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.render.DoricNode;
import com.github.penfeizhou.doric.extension.render.ViewNode;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricNode(name = "Image")
public class ImageNode extends ViewNode <ImageView>{
    public ImageNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public ImageView build(JSObject jsObject) {
        return null;
    }
}
