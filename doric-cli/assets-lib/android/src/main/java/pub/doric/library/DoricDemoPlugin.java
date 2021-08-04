package pub.doric.library;

import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.plugin.DoricJavaPlugin;

@DoricPlugin(name = "demoPlugin")
public class DoricDemoPlugin extends DoricJavaPlugin {
    public DoricDemoPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void call(DoricPromise promise) {
        promise.resolve(new JavaValue("This is from android"));
    }
}
