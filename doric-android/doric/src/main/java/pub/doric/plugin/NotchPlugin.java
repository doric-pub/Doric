package pub.doric.plugin;

import android.view.View;

import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;
import com.qmuiteam.qmui.util.QMUINotchHelper;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.ThreadMode;

@DoricPlugin(name = "notch")
public class NotchPlugin extends DoricJavaPlugin {

    public NotchPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void inset(JSObject jsObject, final DoricPromise promise) {
        View view = getDoricContext().getRootNode().getNodeView();
        int top = QMUINotchHelper.getSafeInsetTop(view);
        int left = QMUINotchHelper.getSafeInsetLeft(view);
        int bottom = QMUINotchHelper.getSafeInsetBottom(view);
        int right = QMUINotchHelper.getSafeInsetRight(view);
        promise.resolve(new JavaValue(new JSONBuilder()
                .put("top", top)
                .put("left", left)
                .put("bottom", bottom)
                .put("right", right).toJSONObject()));
    }
}
