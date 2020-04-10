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

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Base64;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.DrawableImageViewTarget;
import com.bumptech.glide.request.target.SizeReadyCallback;
import com.bumptech.glide.request.target.Target;
import com.facebook.yoga.YogaNode;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jp.wasabeef.glide.transformations.BlurTransformation;
import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.flex.FlexNode;
import pub.doric.utils.DoricLog;
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
    private String placeHolderImage;
    private String errorImage;
    private int placeHolderColor = Color.TRANSPARENT;
    private int errorColor = Color.TRANSPARENT;

    public ImageNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blendLayoutConfig(JSObject jsObject) {
        super.blendLayoutConfig(jsObject);
        JSValue maxWidth = jsObject.getProperty("maxWidth");
        if (maxWidth.isNumber()) {
            mView.setMaxWidth(DoricUtils.dp2px(maxWidth.asNumber().toFloat()));
        }
        JSValue maxHeight = jsObject.getProperty("maxHeight");
        if (maxHeight.isNumber()) {
            mView.setMaxHeight(DoricUtils.dp2px(maxWidth.asNumber().toFloat()));
        }
    }

    @Override
    protected ImageView build() {
        ImageView imageView = new ImageView(getContext()) {
            @Override
            protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
                super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            }
        };
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        imageView.setAdjustViewBounds(true);
        return imageView;
    }

    @Override
    public void blend(JSObject jsObject) {
        if (jsObject != null) {
            JSValue jsValue = jsObject.getProperty("isBlur");
            if (jsValue.isBoolean()) {
                isBlur = jsValue.asBoolean().value();
            }
            JSValue placeHolder = jsObject.getProperty("placeHolderImage");
            if (placeHolder.isString()) {
                this.placeHolderImage = placeHolder.asString().value();
            }
            JSValue error = jsObject.getProperty("errorImage");
            if (error.isString()) {
                this.errorImage = error.asString().value();
            }
            JSValue placeHolderColor = jsObject.getProperty("placeHolderColor");
            if (placeHolderColor.isNumber()) {
                this.placeHolderColor = placeHolderColor.asNumber().toInt();
            }
            JSValue errorColor = jsObject.getProperty("errorColor");
            if (errorColor.isNumber()) {
                this.errorColor = errorColor.asNumber().toInt();
            }
        }
        super.blend(jsObject);
    }

    private Drawable getPlaceHolderDrawable() {
        if (!TextUtils.isEmpty(placeHolderImage)) {
            int resId = getContext().getResources().getIdentifier(
                    placeHolderImage.toLowerCase(),
                    "drawable",
                    getContext().getPackageName());
            if (resId > 0) {
                return getContext().getResources().getDrawable(resId);
            } else {
                DoricLog.e("Cannot find PlaceHolder Drawable for " + placeHolderImage);
                return new ColorDrawable(Color.GRAY);
            }
        } else if (placeHolderColor != Color.TRANSPARENT) {
            return new ColorDrawable(placeHolderColor);
        } else {
            return getDoricContext().getDriver().getRegistry().getDefaultPlaceHolderDrawable();
        }
    }

    private Drawable getErrorDrawable() {
        if (!TextUtils.isEmpty(errorImage)) {
            int resId = getContext().getResources().getIdentifier(
                    errorImage.toLowerCase(),
                    "drawable",
                    getContext().getPackageName());
            if (resId > 0) {
                return getContext().getResources().getDrawable(resId);
            } else {
                DoricLog.e("Cannot find Error Drawable for " + errorImage);
                return new ColorDrawable(Color.GRAY);
            }
        } else if (errorColor != Color.TRANSPARENT) {
            return new ColorDrawable(errorColor);
        } else {
            return getDoricContext().getDriver().getRegistry().getDefaultErrorDrawable();
        }
    }

    private void loadImageUrl(String url) {
        RequestBuilder<Drawable> requestBuilder = Glide.with(getContext())
                .load(url);
        loadIntoTarget(requestBuilder);
    }


    private void loadIntoTarget(RequestBuilder<Drawable> requestBuilder) {
        try {
            requestBuilder = requestBuilder.apply(new RequestOptions().override(Target.SIZE_ORIGINAL));
            if (isBlur) {
                requestBuilder = requestBuilder
                        .apply(RequestOptions
                                .bitmapTransform(new BlurTransformation(25, 3)));
            }
            Drawable placeHolderDrawable = getPlaceHolderDrawable();

            if (placeHolderDrawable != null) {
                requestBuilder = requestBuilder.apply(RequestOptions.placeholderOf(placeHolderDrawable));
            }

            Drawable errorDrawable = getErrorDrawable();
            if (errorDrawable != null) {
                requestBuilder = requestBuilder.apply(RequestOptions.errorOf(errorDrawable));
            }
        } catch (Throwable e) {
            e.printStackTrace();
            DoricLog.e("ImageNode blend error, please check the glide version");
        }

        requestBuilder
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
                            if (resource instanceof BitmapDrawable) {
                                Bitmap bitmap = ((BitmapDrawable) resource).getBitmap();
                                callJSResponse(loadCallbackId, new JSONBuilder()
                                        .put("width", DoricUtils.px2dp(bitmap.getWidth()))
                                        .put("height", DoricUtils.px2dp(bitmap.getHeight()))
                                        .toJSONObject());
                            } else {
                                callJSResponse(loadCallbackId, new JSONBuilder()
                                        .put("width", DoricUtils.px2dp(resource.getIntrinsicWidth()))
                                        .put("height", DoricUtils.px2dp(resource.getIntrinsicHeight()))
                                        .toJSONObject());
                            }
                        }
                        return false;
                    }
                }).into(new DrawableImageViewTarget(mView) {

            @SuppressLint("MissingSuperCall")
            @Override
            public void getSize(@NonNull SizeReadyCallback cb) {
                cb.onSizeReady(SIZE_ORIGINAL, SIZE_ORIGINAL);
            }

            @Override
            protected void setResource(@Nullable Drawable resource) {
                super.setResource(resource);
                if (mSuperNode instanceof FlexNode) {
                    YogaNode node = ((FlexNode) mSuperNode).mView.getYogaNodeForView(mView);
                    if (node != null) {
                        node.dirty();
                    }
                    mView.requestLayout();
                }
            }
        });
    }

    @Override
    protected void blend(ImageView view, String name, JSValue prop) {
        switch (name) {
            case "imageUrl":
                if (!prop.isString()) {
                    return;
                }
                loadImageUrl(prop.asString().value());
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
                if (!prop.isString()) {
                    return;
                }
                Pattern r = Pattern.compile("data:image/(\\S+?);base64,(\\S+)");
                Matcher m = r.matcher(prop.asString().value());
                if (m.find()) {
                    String imageType = m.group(1);
                    String base64 = m.group(2);
                    if (!TextUtils.isEmpty(imageType) && !TextUtils.isEmpty(base64)) {
                        try {
                            byte[] data = Base64.decode(base64, Base64.DEFAULT);
                            loadIntoTarget(Glide.with(getContext()).load(data));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
                break;
            case "imagePath":
                if (!prop.isString()) {
                    return;
                }
                String localName = prop.asString().value();
                loadImageUrl("file:///android_asset/" + localName);
                break;
            case "imageRes":
                if (!prop.isString()) {
                    return;
                }
                int resId = getContext().getResources().getIdentifier(
                        prop.asString().value().toLowerCase(),
                        "drawable",
                        getDoricContext().getContext().getPackageName());
                if (resId > 0) {
                    loadIntoTarget(Glide.with(getContext()).load(resId));
                } else {
                    if (!TextUtils.isEmpty(loadCallbackId)) {
                        callJSResponse(loadCallbackId);
                    }
                }
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
