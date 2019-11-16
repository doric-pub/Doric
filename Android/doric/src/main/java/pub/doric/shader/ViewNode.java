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

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import pub.doric.DoricContext;
import pub.doric.DoricRegistry;
import pub.doric.async.AsyncResult;
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
        this.mSuperNode = superNode;
        this.mLayoutParams = superNode.generateDefaultLayoutParams();
        this.doricLayer = new DoricLayer(getContext());
        this.doricLayer.setLayoutParams(mLayoutParams);
        this.mView = build();
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(mLayoutParams.width, mLayoutParams.height);
        doricLayer.addView(mView, params);
    }

    public void setId(String id) {
        this.mId = id;
    }

    public String getType(){
        return mType;
    }

    public View getDoricLayer() {
        return doricLayer;
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
        ViewGroup.LayoutParams params = mView.getLayoutParams();
        if (params != null) {
            params.width = mLayoutParams.width;
            params.height = mLayoutParams.height;
        } else {
            params = mLayoutParams;
        }
        mView.setLayoutParams(params);
    }

    protected void blend(T view, String name, JSValue prop) {
        switch (name) {
            case "width":
                if (mLayoutParams.width >= 0) {
                    mLayoutParams.width = DoricUtils.dp2px(prop.asNumber().toFloat());
                }
                break;
            case "height":
                if (mLayoutParams.height >= 0) {
                    mLayoutParams.height = DoricUtils.dp2px(prop.asNumber().toFloat());
                }
                break;
            case "x":
                if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
                    float x = prop.asNumber().toFloat();
                    ((ViewGroup.MarginLayoutParams) mLayoutParams).leftMargin = DoricUtils.dp2px(x);
                }
                break;
            case "y":
                if (mLayoutParams instanceof ViewGroup.MarginLayoutParams) {
                    float y = prop.asNumber().toFloat();
                    ((ViewGroup.MarginLayoutParams) mLayoutParams).topMargin = DoricUtils.dp2px(y);
                }
                break;
            case "bgColor":
                view.setBackgroundColor(prop.asNumber().toInt());
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
                if (prop.isObject() && mSuperNode != null) {
                    mSuperNode.blendSubLayoutConfig(this, prop.asObject());
                }
                break;
            case "border":
                if (prop.isObject() && doricLayer != null) {
                    doricLayer.setBorder(DoricUtils.dp2px(prop.asObject().getProperty("width").asNumber().toFloat()),
                            prop.asObject().getProperty("color").asNumber().toInt());
                }
                break;
            case "corners":
                if (doricLayer != null) {
                    if (prop.isNumber()) {
                        doricLayer.setCornerRadius(DoricUtils.dp2px(prop.asNumber().toFloat()));
                    } else if (prop.isObject()) {
                        JSValue lt = prop.asObject().getProperty("leftTop");
                        JSValue rt = prop.asObject().getProperty("rightTop");
                        JSValue rb = prop.asObject().getProperty("rightBottom");
                        JSValue lb = prop.asObject().getProperty("leftBottom");
                        doricLayer.setCornerRadius(
                                DoricUtils.dp2px(lt.isNumber() ? lt.asNumber().toFloat() : 0),
                                DoricUtils.dp2px(rt.isNumber() ? rt.asNumber().toFloat() : 0),
                                DoricUtils.dp2px(rb.isNumber() ? rb.asNumber().toFloat() : 0),
                                DoricUtils.dp2px(lb.isNumber() ? lb.asNumber().toFloat() : 0)
                        );
                    }
                }

                break;
            case "shadow":
                if (doricLayer != null) {
                    if (prop.isObject()) {
                        doricLayer.setShadow(
                                prop.asObject().getProperty("color").asNumber().toInt(),
                                (int) (prop.asObject().getProperty("opacity").asNumber().toFloat() * 255),
                                DoricUtils.dp2px(prop.asObject().getProperty("radius").asNumber().toFloat()),
                                DoricUtils.dp2px(prop.asObject().getProperty("offsetX").asNumber().toFloat()),
                                DoricUtils.dp2px(prop.asObject().getProperty("offsetY").asNumber().toFloat())
                        );
                    }
                }
                break;
            default:
                break;
        }
    }

    String[] getIdList() {
        LinkedList<String> ids = new LinkedList<>();
        ViewNode viewNode = this;
        do {
            ids.push(viewNode.mId);
            viewNode = viewNode.mSuperNode;
        } while (viewNode != null && !(viewNode instanceof RootNode));

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
}
