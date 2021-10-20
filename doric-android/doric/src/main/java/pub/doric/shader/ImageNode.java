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
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.NinePatchDrawable;
import android.os.Build;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Pair;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatImageView;

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

import java.io.File;
import java.io.InputStream;

import jp.wasabeef.glide.transformations.BlurTransformation;
import pub.doric.DoricContext;
import pub.doric.DoricSingleton;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.resource.DoricResource;
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
    private String placeHolderImageBase64;
    private String errorImage;
    private String errorImageBase64;
    private int placeHolderColor = Color.TRANSPARENT;
    private int errorColor = Color.TRANSPARENT;
    private JSObject stretchInset = null;
    private float imageScale = DoricUtils.getScreenScale();

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
        ImageView imageView = new AppCompatImageView(getContext()) {
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
            JSValue placeHolderBase64 = jsObject.getProperty("placeHolderImageBase64");
            if (placeHolderBase64.isString()) {
                this.placeHolderImageBase64 = placeHolderBase64.asString().value();
            }
            JSValue errorBase64 = jsObject.getProperty("errorImageBase64");
            if (errorBase64.isString()) {
                this.errorImageBase64 = errorBase64.asString().value();
            }
            JSValue placeHolderColor = jsObject.getProperty("placeHolderColor");
            if (placeHolderColor.isNumber()) {
                this.placeHolderColor = placeHolderColor.asNumber().toInt();
            }
            JSValue errorColor = jsObject.getProperty("errorColor");
            if (errorColor.isNumber()) {
                this.errorColor = errorColor.asNumber().toInt();
            }
            JSValue stretchInsetValue = jsObject.getProperty("stretchInset");
            if (stretchInsetValue.isObject()) {
                this.stretchInset = stretchInsetValue.asObject();
            }
            JSValue imageScaleValue = jsObject.getProperty("imageScale");
            if (imageScaleValue.isNumber()) {
                this.imageScale = imageScaleValue.asNumber().toFloat();
            }
            JSValue loadCallback = jsObject.getProperty("loadCallback");
            if (loadCallback.isString()) {
                this.loadCallbackId = loadCallback.asString().value();
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
        } else if (!TextUtils.isEmpty(placeHolderImageBase64)) {
            Pair<String, String> result = DoricUtils.translateBase64(placeHolderImageBase64);
            if (result != null) {
                String imageType = result.first;
                String base64 = result.second;

                if (!TextUtils.isEmpty(imageType) && !TextUtils.isEmpty(base64)) {
                    try {
                        byte[] data = Base64.decode(base64, Base64.DEFAULT);
                        return new BitmapDrawable(getContext().getResources(), BitmapFactory.decodeByteArray(data, 0, data.length));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            DoricLog.e("Cannot find PlaceHolderBase64 Drawable for " + placeHolderImageBase64);
            return getDoricContext().getDriver().getRegistry().getDefaultPlaceHolderDrawable();
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
        } else if (!TextUtils.isEmpty(errorImageBase64)) {
            Pair<String, String> result = DoricUtils.translateBase64(errorImageBase64);
            if (result != null) {
                String imageType = result.first;
                String base64 = result.second;

                if (!TextUtils.isEmpty(imageType) && !TextUtils.isEmpty(base64)) {
                    try {
                        byte[] data = Base64.decode(base64, Base64.DEFAULT);
                        return new BitmapDrawable(getContext().getResources(), BitmapFactory.decodeByteArray(data, 0, data.length));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            DoricLog.e("Cannot find ErrorBase64 Drawable for " + errorImageBase64);
            return getDoricContext().getDriver().getRegistry().getDefaultErrorDrawable();
        } else if (errorColor != Color.TRANSPARENT) {
            return new ColorDrawable(errorColor);
        } else {
            return getDoricContext().getDriver().getRegistry().getDefaultErrorDrawable();
        }
    }

    private void loadImageUrl(String url) {
        Context context = DoricUtils.unwrap(getContext());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            if (context instanceof Activity && ((Activity) context).isDestroyed()) {
                return;
            }
        }
        RequestBuilder<Drawable> requestBuilder = Glide.with(context)
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
                                        .put("animated", resource instanceof Animatable)
                                        .toJSONObject());
                            } else {
                                callJSResponse(loadCallbackId, new JSONBuilder()
                                        .put("width", DoricUtils.px2dp(resource.getIntrinsicWidth()))
                                        .put("height", DoricUtils.px2dp(resource.getIntrinsicHeight()))
                                        .put("animated", resource instanceof Animatable)
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
                if (resource instanceof BitmapDrawable) {
                    Bitmap bitmap = ((BitmapDrawable) resource).getBitmap();
                    float scale = DoricUtils.getScreenScale() / imageScale;
                    if (imageScale != DoricUtils.getScreenScale()) {
                        Matrix matrix = new Matrix();
                        matrix.setScale(scale, scale);
                        bitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
                        resource = new BitmapDrawable(getContext().getResources(), bitmap);
                    }
                    if (stretchInset != null) {
                        float left = stretchInset.getProperty("left").asNumber().toFloat() * scale;
                        float top = stretchInset.getProperty("top").asNumber().toFloat() * scale;
                        float right = stretchInset.getProperty("right").asNumber().toFloat() * scale;
                        float bottom = stretchInset.getProperty("bottom").asNumber().toFloat() * scale;

                        Rect rect = new Rect(
                                (int) left,
                                (int) top,
                                (int) (bitmap.getWidth() - right),
                                (int) (bitmap.getHeight() - bottom)
                        );

                        NinePatchDrawable ninePatchDrawable = new NinePatchDrawable(
                                getContext().getResources(),
                                bitmap,
                                DoricUtils.getNinePatchChunk(rect),
                                rect,
                                null
                        );
                        super.setResource(ninePatchDrawable);
                    } else {
                        super.setResource(resource);
                    }
                } else {
                    super.setResource(resource);
                }
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
            case "image":
                if (!prop.isObject()) {
                    return;
                }
                JSObject resource = prop.asObject();
                final String type = resource.getProperty("type").asString().value();
                final String identifier = resource.getProperty("identifier").asString().value();
                DoricResource doricResource = getDoricContext().getDriver().getRegistry().getResourceManager().load(getDoricContext(), type, identifier);
                if (doricResource != null) {
                    doricResource.asInputStream().setCallback(new AsyncResult.Callback<InputStream>() {
                        @Override
                        public void onResult(InputStream result) {
                            loadIntoTarget(Glide.with(getContext()).load(result));
                        }

                        @Override
                        public void onError(Throwable t) {
                            t.printStackTrace();
                            DoricLog.e("Cannot load resource type = %s, identifier = %s, %s", type, identifier, t.getLocalizedMessage());
                        }

                        @Override
                        public void onFinish() {

                        }
                    });
                } else {
                    DoricLog.e("Cannot find loader for resource type = %s, identifier = %s", type, identifier);
                }
                break;
            case "imageUrl":
                if (!prop.isString()) {
                    return;
                }
                loadImageUrl(prop.asString().value());
                break;
            case "scaleType":
                if (!prop.isNumber()) {
                    return;
                }
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
                // Do not need set
                break;
            case "imageBase64":
                if (!prop.isString()) {
                    return;
                }
                String input = prop.asString().value();
                Pair<String, String> result = DoricUtils.translateBase64(input);
                if (result != null) {
                    String imageType = result.first;
                    String base64 = result.second;

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
            case "imageFilePath":
                if (!prop.isString()) {
                    return;
                }
                String filePath = prop.asString().value();
                File file = new File(filePath);
                loadIntoTarget(Glide.with(getContext()).load(file));
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @DoricMethod
    public boolean isAnimating() {
        Drawable drawable = mView.getDrawable();
        if (drawable instanceof Animatable) {
            return ((Animatable) drawable).isRunning();
        }
        return false;
    }

    @DoricMethod
    public void startAnimating() {
        Drawable drawable = mView.getDrawable();
        if (drawable instanceof Animatable) {
            ((Animatable) drawable).start();
        }
    }

    @DoricMethod
    public void stopAnimating() {
        Drawable drawable = mView.getDrawable();
        if (drawable instanceof Animatable) {
            ((Animatable) drawable).stop();
        }
    }
}
