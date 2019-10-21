package pub.doric.shader;

import android.util.TypedValue;
import android.view.ViewGroup;
import android.widget.TextView;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
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
    protected TextView build(JSObject jsObject) {
        return new TextView(getContext());
    }

    @Override
    protected void blend(TextView view, ViewGroup.LayoutParams params, String name, JSValue prop) {
        switch (name) {
            case "text":
                view.setText(prop.asString().toString());
                break;
            case "textSize":
                view.setTextSize(TypedValue.COMPLEX_UNIT_DIP, prop.asNumber().toFloat());
                break;
            case "textColor":
                view.setTextColor(prop.asNumber().toInt());
                break;
            case "textAlignment":
                view.setGravity(prop.asNumber().toInt());
                break;
            default:
                super.blend(view, params, name, prop);
                break;
        }
    }
}
