package pub.doric.shader;

import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Root")
public class RootNode extends StackNode {
    public RootNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    public View getView() {
        return mView;
    }

    public void setRootView(FrameLayout rootView) {
        this.mView = rootView;
    }

    @Override
    public ViewGroup.LayoutParams getLayoutParams() {
        return mView.getLayoutParams();
    }

    public void render(JSObject props) {
        blend(props, getLayoutParams());
    }
}
