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
import android.animation.ArgbEvaluator;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;

import pub.doric.DoricContext;
import pub.doric.DoricRegistry;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.utils.DoricContextHolder;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.utils.DoricUtils;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.LinkedList;

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
            case "bgColor":
                if (isAnimating()) {
                    ObjectAnimator animator = ObjectAnimator.ofInt(
                            this,
                            name,
                            getBgColor(),
                            prop.asNumber().toInt());
                    animator.setEvaluator(new ArgbEvaluator());
                    addAnimator(animator);
                } else {
                    setBgColor(prop.asNumber().toInt());
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
            case "onClick":
                final String functionId = prop.asString().value();
                view.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        callJSResponse(functionId);
                    }
                });
                break;
            case "layoutConfig":
                setLayoutConfig(prop.asObject());
                break;
            case "border":
                if (prop.isObject()) {
                    requireDoricLayer().setBorder(DoricUtils.dp2px(prop.asObject().getProperty("width").asNumber().toFloat()),
                            prop.asObject().getProperty("color").asNumber().toInt());
                }
                break;
            case "corners":
                if (prop.isNumber()) {
                    requireDoricLayer().setCornerRadius(DoricUtils.dp2px(prop.asNumber().toFloat()));
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
        return DoricUtils.px2dp(getNodeView().getWidth());
    }

    @DoricMethod
    public float getHeight() {
        return DoricUtils.px2dp(getNodeView().getHeight());
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
    protected void setWidth(float width) {
        if (mLayoutParams.width >= 0) {
            mLayoutParams.width = DoricUtils.dp2px(width);
            mView.requestLayout();
        }
    }

    @DoricMethod
    protected void setHeight(float height) {
        if (mLayoutParams.height >= 0) {
            mLayoutParams.height = DoricUtils.dp2px(height);
            mView.requestLayout();
        }
    }

    @DoricMethod
    protected void setX(float x) {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            ((ViewGroup.MarginLayoutParams) mLayoutParams).leftMargin = DoricUtils.dp2px(x);
            mView.requestLayout();
        }
    }

    @DoricMethod
    protected void setY(float y) {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            ((ViewGroup.MarginLayoutParams) mLayoutParams).topMargin = DoricUtils.dp2px(y);
            mView.requestLayout();
        }
    }

    @DoricMethod
    public float getX() {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            return DoricUtils.px2dp(((ViewGroup.MarginLayoutParams) mLayoutParams).leftMargin);
        }
        return 0;
    }

    @DoricMethod
    public float getY() {
        if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
            return DoricUtils.px2dp(((ViewGroup.MarginLayoutParams) mLayoutParams).topMargin);
        }
        return 0;
    }

    @DoricMethod
    public int getBgColor() {
        if (mView.getBackground() instanceof ColorDrawable) {
            return ((ColorDrawable) mView.getBackground()).getColor();
        }
        return Color.TRANSPARENT;
    }

    @DoricMethod
    public void setBgColor(int color) {
        mView.setBackgroundColor(color);
    }
}
