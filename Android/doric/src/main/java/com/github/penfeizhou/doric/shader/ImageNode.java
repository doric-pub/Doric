package com.github.penfeizhou.doric.shader;

import android.widget.ImageView;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Image")
public class ImageNode extends ViewNode<ImageView> {
    public ImageNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected ImageView build(JSObject jsObject) {
        return null;
    }
}
