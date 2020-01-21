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

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Base64;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.Target;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jp.wasabeef.glide.transformations.BlurTransformation;
import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.utils.DoricUtils;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Image")
public class ImageNode extends ViewNode<ImageView> {
    private String loadCallbackId = "";
    private boolean isBlur;

    public ImageNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected ImageView build() {
        return new ImageView(getContext());
    }

    @Override
    public void blend(JSObject jsObject) {
        if (jsObject != null) {
            JSValue jsValue = jsObject.getProperty("isBlur");
            if (jsValue.isBoolean()) {
                isBlur = jsValue.asBoolean().value();
            }
        }
        super.blend(jsObject);
    }

    @Override
    protected void blend(ImageView view, String name, JSValue prop) {
        switch (name) {
            case "imageUrl":
                RequestOptions options;
                if (isBlur) {
                    options = RequestOptions.bitmapTransform(new BlurTransformation(25, 3));
                } else {
                    options = new RequestOptions();
                }
                Glide.with(getContext()).load(prop.asString().value())
                        .apply(options)
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
                                            .put("width", DoricUtils.px2dp(resource.getIntrinsicWidth()))
                                            .put("height", DoricUtils.px2dp(resource.getIntrinsicHeight()))
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
            case "imageBase64":
                Pattern r = Pattern.compile("data:image/(\\S+?);base64,(\\S+)");
                Matcher m = r.matcher(prop.asString().value());
                if (m.find()) {
                    String imageType = m.group(1);
                    String base64 = m.group(2);
                    if (!TextUtils.isEmpty(imageType) && !TextUtils.isEmpty(base64)) {
                        try {
                            byte[] data = Base64.decode(base64, Base64.DEFAULT);
                            Bitmap bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);
                            view.setImageBitmap(bitmap);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
