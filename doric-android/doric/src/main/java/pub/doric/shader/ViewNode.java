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

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ArgbEvaluator;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.GradientDrawable;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.Interpolator;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.interpolator.view.animation.FastOutSlowInInterpolator;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONObject;

import java.util.LinkedList;

import pub.doric.DoricContext;
import pub.doric.DoricRegistry;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.DoricContextHolder;
import pub.doric.utils.DoricLog;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.utils.DoricUtils;

/**
 * @Description: Render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class ViewNode<T extends View> extends DoricContextHolder {
    protected T mView;
    SuperNode mSuperNode;
    String mId;
    protected ViewGroup.LayoutParams mLayoutParams;
    private String mType;

    public ViewNode(DoricContext doricContext) {
        super(doricContext);
    }

    private DoricLayer doricLayer;

    public void init(SuperNode superNode) {
        if (this instanceof SuperNode) {
            ((SuperNode<T>) this).mReusable = superNode.mReusable;
        }
        this.mSuperNode = superNode;
        this.mLayoutParams = superNode.generateDefaultLayoutParams();
        this.mView = build();
        this.mView.setLayoutParams(mLayoutParams);
    }

    public void init(ViewGroup.LayoutParams layoutParams) {
        this.mLayoutParams = layoutParams;
        this.mView = build();
        this.mView.setLayoutParams(layoutParams);
    }

    public void setId(String id) {
        this.mId = id;
    }

    public String getType() {
        return mType;
    }

    public View getNodeView() {
        if (doricLayer != null) {
            return doricLayer;
        } else {
            return mView;
        }
    }

    public Context getContext() {
        return getDoricContext().getContext();
    }

    protected abstract T build();

    public void blend(JSObject jsObject) {
        if (jsObject != null) {
            JSValue value = jsObject.getProperty("layoutConfig");
            if (value.isObject()) {
                setLayoutConfig(value.asObject());
            }
            for (String prop : jsObject.propertySet()) {
                blend(mView, prop, jsObject.getProperty(prop));
            }
        }
        if (doricLayer != null) {
            ViewGroup.LayoutParams params = mView.getLayoutParams();
            if (params != null) {
                params.width = mLayoutParams.width;
                params.height = mLayoutParams.height;
            } else {
                params = mLayoutParams;
            }
            if (mLayoutParams instanceof LinearLayout.LayoutParams && ((LinearLayout.LayoutParams) mLayoutParams).weight > 0) {
                if (mSuperNode instanceof VLayoutNode) {
                    params.height = ViewGroup.LayoutParams.MATCH_PARENT;
                } else if (mSuperNode instanceof HLayoutNode) {
                    params.width = ViewGroup.LayoutParams.MATCH_PARENT;
                }
            }

            mView.setLayoutParams(params);
        }
    }

    protected void blend(T view, String name, JSValue prop) {
        switch (name) {
            case "width":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getWidth(),
                            prop.asNumber().toFloat()));
                } else {
                    setWidth(prop.asNumber().toFloat());
                }
                break;
            case "height":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getHeight(),
                            prop.asNumber().toFloat()));
                } else {
                    setHeight(prop.asNumber().toFloat());
                }
                break;
            case "x":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getX(),
                            prop.asNumber().toFloat()));
                } else {
                    setX(prop.asNumber().toFloat());
                }
                break;
            case "y":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getY(),
                            prop.asNumber().toFloat()));
                } else {
                    setY(prop.asNumber().toFloat());
                }
                break;
            case "backgroundColor":
                if (isAnimating()) {
                    if (prop.isNumber()) {
                        ObjectAnimator animator = ObjectAnimator.ofInt(
                                this,
                                name,
                                getBackgroundColor(),
                                prop.asNumber().toInt());
                        animator.setEvaluator(new ArgbEvaluator());
                        addAnimator(animator);
                    }
                } else {
                    if (prop.isNumber()) {
                        setBackgroundColor(prop.asNumber().toInt());
                    } else if (prop.isObject()) {
                        JSValue start = prop.asObject().getProperty("start");
                        JSValue end = prop.asObject().getProperty("end");
                        JSValue orientation = prop.asObject().getProperty("orientation");

                        GradientDrawable gradientDrawable = new GradientDrawable();
                        gradientDrawable.setShape(GradientDrawable.RECTANGLE);
                        gradientDrawable.setColors(new int[]{start.asNumber().toInt(), end.asNumber().toInt()});
                        gradientDrawable.setGradientType(GradientDrawable.LINEAR_GRADIENT);

                        switch (orientation.asNumber().toInt()) {
                            case 0:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.TOP_BOTTOM);
                                break;
                            case 1:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.TR_BL);
                                break;
                            case 2:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.RIGHT_LEFT);
                                break;
                            case 3:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.BR_TL);
                                break;
                            case 4:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.BOTTOM_TOP);
                                break;
                            case 5:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.BL_TR);
                                break;
                            case 6:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.LEFT_RIGHT);
                                break;
                            case 7:
                                gradientDrawable.setOrientation(GradientDrawable.Orientation.TL_BR);
                                break;
                        }

                        gradientDrawable.setSize(view.getMeasuredWidth(), view.getMeasuredHeight());
                        view.setBackground(gradientDrawable);
                    }
                }
                break;
            case "onClick":
                final String functionId = prop.asString().value();
                view.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        callJSResponse(functionId);
                    }
                });
                break;
            case "border":
                if (prop.isObject()) {
                    requireDoricLayer().setBorder(DoricUtils.dp2px(prop.asObject().getProperty("width").asNumber().toFloat()),
                            prop.asObject().getProperty("color").asNumber().toInt());
                    requireDoricLayer().invalidate();
                }
                break;
            case "alpha":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getAlpha(),
                            prop.asNumber().toFloat()));
                } else {
                    setAlpha(prop.asNumber().toFloat());
                }
                break;
            case "corners":
                if (prop.isNumber()) {
                    if (isAnimating()) {
                        addAnimator(ObjectAnimator.ofFloat(
                                this,
                                name,
                                getCorners(),
                                prop.asNumber().toFloat()));
                    } else {
                        setCorners(prop.asNumber().toFloat());
                    }
                } else if (prop.isObject()) {
                    JSValue lt = prop.asObject().getProperty("leftTop");
                    JSValue rt = prop.asObject().getProperty("rightTop");
                    JSValue rb = prop.asObject().getProperty("rightBottom");
                    JSValue lb = prop.asObject().getProperty("leftBottom");
                    requireDoricLayer().setCornerRadius(
                            DoricUtils.dp2px(lt.isNumber() ? lt.asNumber().toFloat() : 0),
                            DoricUtils.dp2px(rt.isNumber() ? rt.asNumber().toFloat() : 0),
                            DoricUtils.dp2px(rb.isNumber() ? rb.asNumber().toFloat() : 0),
                            DoricUtils.dp2px(lb.isNumber() ? lb.asNumber().toFloat() : 0)
                    );
                }
                break;
            case "shadow":
                if (prop.isObject()) {
                    requireDoricLayer().setShadow(
                            prop.asObject().getProperty("color").asNumber().toInt(),
                            (int) (prop.asObject().getProperty("opacity").asNumber().toFloat() * 255),
                            DoricUtils.dp2px(prop.asObject().getProperty("radius").asNumber().toFloat()),
                            DoricUtils.dp2px(prop.asObject().getProperty("offsetX").asNumber().toFloat()),
                            DoricUtils.dp2px(prop.asObject().getProperty("offsetY").asNumber().toFloat())
                    );
                }
                break;
            case "translationX":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getTranslationX(),
                            prop.asNumber().toFloat()));
                } else {
                    setTranslationX(prop.asNumber().toFloat());
                }
                break;
            case "translationY":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getTranslationY(),
                            prop.asNumber().toFloat()));
                } else {
                    setTranslationY(prop.asNumber().toFloat());
                }
                break;
            case "scaleX":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getScaleX(),
                            prop.asNumber().toFloat()));
                } else {
                    setScaleX(prop.asNumber().toFloat());
                }
                break;
            case "scaleY":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getScaleY(),
                            prop.asNumber().toFloat()));
                } else {
                    setScaleY(prop.asNumber().toFloat());
                }
                break;
            case "pivotX":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getPivotX(),
                            prop.asNumber().toFloat()));
                } else {
                    setPivotX(prop.asNumber().toFloat());
                }
                break;
            case "pivotY":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getPivotY(),
                            prop.asNumber().toFloat()));
                } else {
                    setPivotY(prop.asNumber().toFloat());
                }
                break;
            case "rotation":
                if (isAnimating()) {
                    addAnimator(ObjectAnimator.ofFloat(
                            this,
                            name,
                            getRotation(),
                            prop.asNumber().toFloat()));
                } else {
                    setRotation(prop.asNumber().toFloat());
                }
                break;
            case "padding":
                if (prop.isObject()) {
                    setPadding(prop.asObject());
                }
                break;
            case "hidden":
                if (prop.isBoolean()) {
                    getNodeView().setVisibility(prop.asBoolean().value() ? View.GONE : View.VISIBLE);
                }
                break;
            default:
                break;
        }
    }

    @NonNull
    private DoricLayer requireDoricLayer() {
        if (doricLayer == null) {
            doricLayer = new DoricLayer(getContext());
            doricLayer.setLayoutParams(mLayoutParams);
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(mLayoutParams.width, mLayoutParams.height);
            if (mView.getParent() instanceof ViewGroup) {
                //Already added in
                ViewGroup superview = (ViewGroup) mView.getParent();
                int index = superview.indexOfChild(mView);
                superview.removeView(mView);
                doricLayer.addView(mView, params);
                superview.addView(doricLayer, index);
            } else {
                doricLayer.addView(mView, params);
            }
        }
        return doricLayer;
    }

    String[] getIdList() {
        LinkedList<String> ids = new LinkedList<>();
        ViewNode viewNode = this;
        do {
            ids.push(viewNode.mId);
            viewNode = viewNode.mSuperNode;
        } while (viewNode != null);

        return ids.toArray(new String[0]);
    }

    public AsyncResult<JSDecoder> callJSResponse(String funcId, Object... args) {
        final Object[] nArgs = new Object[args.length + 2];
        nArgs[0] = getIdList();
        nArgs[1] = funcId;
        if (args.length > 0) {
            System.arraycopy(args, 0, nArgs, 2, args.length);
        }
        return getDoricContext().callEntity(DoricConstant.DORIC_ENTITY_RESPONSE, nArgs);
    }

    public static ViewNode create(DoricContext doricContext, String type) {
        DoricRegistry registry = doricContext.getDriver().getRegistry();
        DoricMetaInfo<ViewNode> clz = registry.acquireViewNodeInfo(type);
        ViewNode ret = clz.createInstance(doricContext);
        ret.mType = type;
        return ret;
    }

    public ViewGroup.LayoutParams getLayoutParams() {
        return mLayoutParams;
    }

    public String getId() {
        return mId;
    }

    protected void setLayoutConfig(JSObject layoutConfig) {
        if (mSuperNode != null) {
            mSuperNode.blendSubLayoutConfig(this, layoutConfig);
        } else {
            blendLayoutConfig(layoutConfig);
        }
    }

    protected void setPadding(JSObject paddings) {
        JSValue left = paddings.getProperty("left");
        JSValue right = paddings.getProperty("right");
        JSValue top = paddings.getProperty("top");
        JSValue bottom = paddings.getProperty("bottom");
        mView.setPadding(
                left.isNumber() ? DoricUtils.dp2px(left.asNumber().toFloat()) : 0,
                top.isNumber() ? DoricUtils.dp2px(top.asNumber().toFloat()) : 0,
                right.isNumber() ? DoricUtils.dp2px(right.asNumber().toFloat()) : 0,
                bottom.isNumber() ? DoricUtils.dp2px(bottom.asNumber().toFloat()) : 0
        );
    }

    private void blendLayoutConfig(JSObject jsObject) {
        JSValue margin = jsObject.getProperty("margin");
        JSValue widthSpec = jsObject.getProperty("widthSpec");
        JSValue heightSpec = jsObject.getProperty("heightSpec");
        ViewGroup.LayoutParams layoutParams = getLayoutParams();
        if (widthSpec.isNumber()) {
            switch (widthSpec.asNumber().toInt()) {
                case 1:
                    layoutParams.width = ViewGroup.LayoutParams.WRAP_CONTENT;
                    break;
                case 2:
                    layoutParams.width = ViewGroup.LayoutParams.MATCH_PARENT;
                    break;
                default:
                    layoutParams.width = Math.max(0, layoutParams.width);
                    break;
            }
        }
        if (heightSpec.isNumber()) {
            switch (heightSpec.asNumber().toInt()) {
                case 1:
                    layoutParams.height = ViewGroup.LayoutParams.WRAP_CONTENT;
                    break;
                case 2:
                    layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    break;
                default:
                    layoutParams.height = Math.max(0, layoutParams.height);
                    break;
            }
        }
        if (margin.isObject() && layoutParams instanceof ViewGroup.MarginLayoutParams) {
            JSValue topVal = margin.asObject().getProperty("top");
            if (topVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).topMargin = DoricUtils.dp2px(topVal.asNumber().toFloat());
            }
            JSValue leftVal = margin.asObject().getProperty("left");
            if (leftVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).leftMargin = DoricUtils.dp2px(leftVal.asNumber().toFloat());
            }
            JSValue rightVal = margin.asObject().getProperty("right");
            if (rightVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).rightMargin = DoricUtils.dp2px(rightVal.asNumber().toFloat());
            }
            JSValue bottomVal = margin.asObject().getProperty("bottom");
            if (bottomVal.isNumber()) {
                ((ViewGroup.MarginLayoutParams) layoutParams).bottomMargin = DoricUtils.dp2px(bottomVal.asNumber().toFloat());
            }
        }
        JSValue jsValue = jsObject.getProperty("alignment");
        if (jsValue.isNumber() && layoutParams instanceof FrameLayout.LayoutParams) {
            ((FrameLayout.LayoutParams) layoutParams).gravity = jsValue.asNumber().toInt();
        }
    }

    protected boolean isAnimating() {
        return getDoricContext().getAnimatorSet() != null;
    }

    protected void addAnimator(Animator animator) {
        if (getDoricContext().getAnimatorSet() == null) {
            return;
        }
        getDoricContext().getAnimatorSet().play(animator);
    }

    @DoricMethod
    public float getWidth() {
        if (mLayoutParams.width >= 0) {
            return DoricUtils.px2dp(mLayoutParams.width);
        } else {
            return DoricUtils.px2dp(mView.getMeasuredWidth());
        }
    }

    @DoricMethod
    public float getHeight() {
        if (mLayoutParams.width >= 0) {
            return DoricUtils.px2dp(mLayoutParams.height);
        } else {
            return DoricUtils.px2dp(mView.getMeasuredHeight());
        }
    }

    @DoricMethod
    public void setWidth(float width) {
        if (mLayoutParams.width >= 0) {
            mLayoutParams.width = DoricUtils.dp2px(width);
            if (mView.getLayoutParams() != mLayoutParams) {
                mView.getLayoutParams().width = mLayoutParams.width;
            }
            getNodeView().requestLayout();
        }
    }

    @DoricMethod
    public void setHeight(float height) {
        if (mLayoutParams.height >= 0) {
            mLayoutParams.height = DoricUtils.dp2px(height);
            if (mView.getLayoutParams() != mLayoutParams) {
                mView.getLayoutParams().height = mLayoutParams.height;
            }
            getNodeView().requestLayout();
        }
    }

    @DoricMethod
    public void setX(float x) {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            ((ViewGroup.MarginLayoutParams) mLayoutParams).leftMargin = DoricUtils.dp2px(x);
            getNodeView().requestLayout();
        }
    }

    @DoricMethod
    public void setY(float y) {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            ((ViewGroup.MarginLayoutParams) mLayoutParams).topMargin = DoricUtils.dp2px(y);
            getNodeView().requestLayout();
        }
    }

    @DoricMethod
    public float getX() {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            return DoricUtils.px2dp(((ViewGroup.MarginLayoutParams) mLayoutParams).leftMargin);
        }
        return DoricUtils.px2dp(mView.getLeft());
    }

    @DoricMethod
    public float getY() {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            return DoricUtils.px2dp(((ViewGroup.MarginLayoutParams) mLayoutParams).topMargin);
        }
        return DoricUtils.px2dp(mView.getTop());
    }

    @DoricMethod
    public int getBackgroundColor() {
        if (mView.getBackground() instanceof ColorDrawable) {
            return ((ColorDrawable) mView.getBackground()).getColor();
        }
        return Color.TRANSPARENT;
    }

    @DoricMethod
    public void setBackgroundColor(int color) {
        mView.setBackgroundColor(color);
    }

    @DoricMethod
    public void setAlpha(float alpha) {
        getNodeView().setAlpha(alpha);
    }

    @DoricMethod
    public float getAlpha() {
        return getNodeView().getAlpha();
    }

    @DoricMethod
    public void setCorners(float corner) {
        requireDoricLayer().setCornerRadius(DoricUtils.dp2px(corner));
        getNodeView().invalidate();
    }

    @DoricMethod
    public float getCorners() {
        return DoricUtils.px2dp((int) requireDoricLayer().getCornerRadius());
    }

    @DoricMethod
    public void setTranslationX(float v) {
        getNodeView().setTranslationX(DoricUtils.dp2px(v));
    }

    @DoricMethod
    public float getTranslationX() {
        return DoricUtils.px2dp((int) getNodeView().getTranslationX());
    }

    @DoricMethod
    public void setTranslationY(float v) {
        getNodeView().setTranslationY(DoricUtils.dp2px(v));
    }

    @DoricMethod
    public float getTranslationY() {
        return DoricUtils.px2dp((int) getNodeView().getTranslationY());
    }

    @DoricMethod
    public void setScaleX(float v) {
        getNodeView().setScaleX(v);
    }

    @DoricMethod
    public float getScaleX() {
        return getNodeView().getScaleX();
    }

    @DoricMethod
    public void setScaleY(float v) {
        getNodeView().setScaleY(v);
    }

    @DoricMethod
    public float getScaleY() {
        return getNodeView().getScaleY();
    }

    @DoricMethod
    public void setRotation(float rotation) {
        getNodeView().setRotation(rotation * 180);
    }

    @DoricMethod
    public float getRotation() {
        return getNodeView().getRotation() / 180;
    }

    @DoricMethod
    public void setPivotX(float v) {
        getNodeView().setPivotX(v * getNodeView().getWidth());
    }

    @DoricMethod
    public float getPivotX() {
        return getNodeView().getPivotX() / getNodeView().getWidth();
    }

    @DoricMethod
    public void setPivotY(float v) {
        getNodeView().setPivotY(v * getNodeView().getHeight());
    }

    @DoricMethod
    public float getPivotY() {
        return getNodeView().getPivotY() / getNodeView().getHeight();
    }

    private String[] animatedKeys = {
            "translationX",
            "translationY",
            "scaleX",
            "scaleY",
            "rotation",
    };

    @DoricMethod
    public void doAnimation(JSValue value, final DoricPromise promise) {
        Animator animator = parseAnimator(value);
        if (animator != null) {
            animator.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    super.onAnimationEnd(animation);
                    JSONBuilder jsonBuilder = new JSONBuilder();
                    for (String key : animatedKeys) {
                        jsonBuilder.put(key, getAnimatedValue(key));
                    }
                    promise.resolve(new JavaValue(jsonBuilder.toJSONObject()));
                }
            });
            animator.start();
        }
    }

    private Animator parseAnimator(JSValue value) {
        if (!value.isObject()) {
            DoricLog.e("parseAnimator error");
            return null;
        }
        JSValue animations = value.asObject().getProperty("animations");
        if (animations.isArray()) {
            AnimatorSet animatorSet = new AnimatorSet();

            for (int i = 0; i < animations.asArray().size(); i++) {
                animatorSet.play(parseAnimator(animations.asArray().get(i)));
            }

            JSValue delayJS = value.asObject().getProperty("delay");
            if (delayJS.isNumber()) {
                animatorSet.setStartDelay(delayJS.asNumber().toLong());
            }
            return animatorSet;
        } else if (value.isObject()) {
            JSArray changeables = value.asObject().getProperty("changeables").asArray();
            AnimatorSet animatorSet = new AnimatorSet();

            JSValue repeatCount = value.asObject().getProperty("repeatCount");

            JSValue repeatMode = value.asObject().getProperty("repeatMode");
            JSValue fillMode = value.asObject().getProperty("fillMode");
            JSValue timingFunction = value.asObject().getProperty("timingFunction");
            for (int j = 0; j < changeables.size(); j++) {
                ObjectAnimator animator = parseChangeable(changeables.get(j).asObject(), fillMode);
                if (repeatCount.isNumber()) {
                    animator.setRepeatCount(repeatCount.asNumber().toInt());
                }
                if (repeatMode.isNumber()) {
                    animator.setRepeatMode(repeatMode.asNumber().toInt());
                }
                if (timingFunction.isNumber()) {
                    animator.setInterpolator(getTimingInterpolator(timingFunction.asNumber().toInt()));
                }
                animatorSet.play(animator);
            }
            long duration = value.asObject().getProperty("duration").asNumber().toLong();
            animatorSet.setDuration(duration);
            JSValue delayJS = value.asObject().getProperty("delay");
            if (delayJS.isNumber()) {
                animatorSet.setStartDelay(delayJS.asNumber().toLong());
            }
            return animatorSet;
        } else {
            return null;
        }
    }

    private Interpolator getTimingInterpolator(int timingFunction) {
        switch (timingFunction) {
            case 1:
                return new LinearInterpolator();
            case 2:
                return new AccelerateInterpolator();
            case 3:
                return new DecelerateInterpolator();
            case 4:
                return new FastOutSlowInInterpolator();
            default:
                return new AccelerateDecelerateInterpolator();
        }
    }

    private ObjectAnimator parseChangeable(JSObject jsObject, JSValue fillMode) {
        String key = jsObject.getProperty("key").asString().value();
        float startVal = jsObject.getProperty("fromValue").asNumber().toFloat();
        float endVal = jsObject.getProperty("toValue").asNumber().toFloat();
        ObjectAnimator animator = ObjectAnimator.ofFloat(this,
                key,
                startVal,
                endVal
        );
        setFillMode(animator, key, startVal, endVal, fillMode);
        return animator;
    }

    private void setFillMode(ObjectAnimator animator,
                             final String key,
                             float startVal,
                             float endVal,
                             JSValue jsValue) {
        int fillMode = 0;
        if (jsValue.isNumber()) {
            fillMode = jsValue.asNumber().toInt();
        }
        if ((fillMode & 2) == 2) {
            setAnimatedValue(key, startVal);
        }
        final int finalFillMode = fillMode;
        animator.addListener(new AnimatorListenerAdapter() {
            private float originVal;

            @Override
            public void onAnimationStart(Animator animation) {
                super.onAnimationStart(animation);
                originVal = getAnimatedValue(key);
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                super.onAnimationEnd(animation);
                if ((finalFillMode & 1) != 1) {
                    setAnimatedValue(key, originVal);
                }
            }
        });
    }

    private void setAnimatedValue(String key, float value) {
        switch (key) {
            case "translationX":
                setTranslationX(value);
                break;
            case "translationY":
                setTranslationY(value);
                break;
            case "scaleX":
                setScaleX(value);
                break;
            case "scaleY":
                setScaleY(value);
                break;
            case "rotation":
                setRotation(value);
                break;
            default:
                break;
        }
    }

    private float getAnimatedValue(String key) {
        switch (key) {
            case "translationX":
                return getTranslationX();
            case "translationY":
                return getTranslationY();
            case "scaleX":
                return getScaleX();
            case "scaleY":
                return getScaleY();
            case "rotation":
                return getRotation();
            default:
                return 0;
        }
    }

    @DoricMethod
    public JSONObject getLocationOnScreen() {
        int[] position = new int[2];
        getNodeView().getLocationOnScreen(position);
        return new JSONBuilder()
                .put("x", DoricUtils.px2dp(position[0]))
                .put("y", DoricUtils.px2dp(position[1]))
                .toJSONObject();
    }
}
