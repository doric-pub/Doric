package pub.doric.plugin;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.ViewNode;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-29
 */
@DoricPlugin(name = "popover")
public class PopoverPlugin extends DoricJavaPlugin {

    public PopoverPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void show(JSDecoder decoder, DoricPromise promise) {
        try {
            JSObject jsObject = decoder.decode().asObject();
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod
    public void dismiss(JSDecoder decoder, DoricPromise promise) {
        try {
            JSObject jsObject = decoder.decode().asObject();
            JSValue value = jsObject.getProperty("id");
            if (value.isString()) {
                String viewId = value.asString().value();
                ViewNode node = getDoricContext().targetViewNode(viewId);
                dismissViewNode(node);
            } else {

            }
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    private void dismissViewNode(ViewNode node) {

    }
}
