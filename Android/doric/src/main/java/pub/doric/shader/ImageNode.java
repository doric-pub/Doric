/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric.shader;

import android.graphics.drawable.Drawable;

import androidx.annotation.Nullable;

import android.text.TextUtils;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Image")
public class ImageNode extends ViewNode<ImageView> {
    private String loadCallbackId = "";

    public ImageNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected ImageView build() {
        return new ImageView(getContext());
    }

    @Override
    protected void blend(ImageView view, String name, JSValue prop) {
        switch (name) {
            case "imageUrl":
                Glide.with(getContext()).load(prop.asString().value())
                        .listener(new RequestListener<Drawable>() {
                            @Override
                            public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<Drawable> target, boolean isFirstResource) {
                                if (!TextUtils.isEmpty(loadCallbackId)) {
                                    callJSResponse(loadCallbackId);
                                }
                                return false;
                            }

                            @Override
                            public boolean onResourceReady(Drawable resource, Object model, Target<Drawable> target, DataSource dataSource, boolean isFirstResource) {
                                if (!TextUtils.isEmpty(loadCallbackId)) {
                                    callJSResponse(loadCallbackId, new JSONBuilder()
                                            .put("width", resource.getIntrinsicWidth())
                                            .put("height", resource.getIntrinsicHeight())
                                            .toJSONObject());
                                }
                                return false;
                            }
                        })
                        .into(view);
                break;
            case "scaleType":
                int scaleType = prop.asNumber().toInt();
                switch (scaleType) {
                    case 1:
                        view.setScaleType(ImageView.ScaleType.FIT_CENTER);
                        break;
                    case 2:
                        view.setScaleType(ImageView.ScaleType.CENTER_CROP);
                        break;
                    default:
                        view.setScaleType(ImageView.ScaleType.FIT_XY);
                        break;
                }
                break;
            case "loadCallback":
                this.loadCallbackId = prop.asString().value();
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
