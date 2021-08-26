package pub.doric.devkit;

import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.utils.ThreadMode;

/**
 * @Description: This is a devkit plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2021/8/26
 */
@DoricPlugin(name = "devkit")
public class DoricDevkitPlugin extends DoricJavaPlugin {
    public DoricDevkitPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void debug(DoricPromise promise) {
        DoricDev.getInstance().openDevMode();
        promise.resolve();
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void isDebug(DoricPromise promise) {
        promise.resolve(new JavaValue(DoricDev.getInstance().isInDevMode()));
    }
}
