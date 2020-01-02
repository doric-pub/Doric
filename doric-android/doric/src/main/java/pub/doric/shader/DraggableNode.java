package pub.doric.shader;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.MotionEvent;
import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

@DoricPlugin(name = "Draggable")
public class DraggableNode extends StackNode {

    private String onDrag;

    public DraggableNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected FrameLayout build() {
        return new DraggableView(getContext());
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("onDrag".equals(name)) {
            if (prop.isString()) {
                onDrag = prop.asString().value();
            } else {
                onDrag = null;
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    private class DraggableView extends FrameLayout {
        private int lastX;

        private int lastY;

        public DraggableView(Context context) {
            super(context);
        }

        @SuppressLint("ClickableViewAccessibility")
        @Override
        public boolean onTouchEvent(MotionEvent event) {
            int x = (int) event.getX();
            int y = (int) event.getY();

            int rawX = (int) event.getRawX();
            int rawY = (int) event.getRawY();

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    lastX = x;
                    lastY = y;
                    break;
                case MotionEvent.ACTION_MOVE:
                    int offsetX = x - lastX;
                    int offsetY = y - lastY;
                    layout(getLeft() + offsetX, getTop() + offsetY, getRight() + offsetX, getBottom() + offsetY);
                    break;
                case MotionEvent.ACTION_UP:
                    break;
            }

            callJSResponse(onDrag, rawX - x, rawY - y);
            return true;
        }
    }
}
