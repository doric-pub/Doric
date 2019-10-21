package pub.doric.shader;

import android.widget.LinearLayout;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-23
 */
@DoricPlugin(name = "HLayout")
public class HLayoutNode extends LinearNode {
    public HLayoutNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected LinearLayout build(JSObject jsObject) {
        LinearLayout linearLayout = super.build(jsObject);
        linearLayout.setOrientation(LinearLayout.HORIZONTAL);
        return linearLayout;
    }
}
