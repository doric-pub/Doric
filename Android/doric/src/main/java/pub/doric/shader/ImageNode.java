package pub.doric.shader;

import android.graphics.drawable.Drawable;
import androidx.annotation.Nullable;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

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
        return new ImageView(getContext());
    }

    @Override
    protected void blend(ImageView view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        if ("imageUrl".equals(name)) {
            Glide.with(getContext()).load(prop.asString().value())
                    .listener(new RequestListener<Drawable>() {
                        @Override
                        public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<Drawable> target, boolean isFirstResource) {
                            return false;
                        }

                        @Override
                        public boolean onResourceReady(Drawable resource, Object model, Target<Drawable> target, DataSource dataSource, boolean isFirstResource) {
                            return false;
                        }
                    })
                    .into(view);
        } else {
            super.blend(view, layoutParams, name, prop);
        }
    }
}
