package pub.doric.plugin;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;

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
    public void show(JSObject jsObject, DoricPromise promise) {

    }

    @DoricMethod
    public void dismiss(JSObject jsObject, DoricPromise promise) {
    }
}
