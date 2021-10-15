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
package pub.doric.shader.flex;

import android.view.View;
import android.view.ViewGroup;

import com.facebook.yoga.YogaAlign;
import com.facebook.yoga.YogaConstants;
import com.facebook.yoga.YogaDirection;
import com.facebook.yoga.YogaDisplay;
import com.facebook.yoga.YogaEdge;
import com.facebook.yoga.YogaFlexDirection;
import com.facebook.yoga.YogaJustify;
import com.facebook.yoga.YogaNode;
import com.facebook.yoga.YogaOverflow;
import com.facebook.yoga.YogaPositionType;
import com.facebook.yoga.YogaUnit;
import com.facebook.yoga.YogaWrap;
import com.facebook.yoga.android.YogaLayout;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.R;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.GroupNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricLog;
import pub.doric.utils.DoricUtils;

/**
 * @Description: FlexBox Node
 * @Author: pengfei.zhou
 * @CreateDate: 2020-04-09
 */
@DoricPlugin(name = "FlexLayout")
public class FlexNode extends GroupNode<YogaLayout> {

    private static final int FLEX_VALUE_TYPE_POINT = 1;
    private static final int FLEX_VALUE_TYPE_PERCENT = 2;
    private static final int FLEX_VALUE_TYPE_AUTO = 3;

    public FlexNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected YogaLayout build() {
        return new YogaLayout(getContext()) {
            @Override
            protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
                for (int i = 0; i < getChildCount(); i++) {
                    View child = getChildAt(i);
                    ViewNode<?> childNode = (ViewNode<?>) child.getTag(R.id.doric_node);
                    if (childNode != null) {
                        ViewGroup.LayoutParams layoutParams = child.getLayoutParams();
                        int childWidthMeasureSpec;
                        int childHeightMeasureSpec;
                        if (layoutParams.width == ViewGroup.LayoutParams.MATCH_PARENT) {
                            childWidthMeasureSpec = MeasureSpec.makeMeasureSpec(
                                    getMeasuredWidth(),
                                    MeasureSpec.AT_MOST);
                        } else if (layoutParams.width == ViewGroup.LayoutParams.WRAP_CONTENT) {
                            childWidthMeasureSpec = MeasureSpec.makeMeasureSpec(
                                    0,
                                    MeasureSpec.UNSPECIFIED);
                        } else {
                            childWidthMeasureSpec = MeasureSpec.makeMeasureSpec(
                                    layoutParams.width,
                                    MeasureSpec.EXACTLY);
                        }

                        if (layoutParams.height == ViewGroup.LayoutParams.MATCH_PARENT) {
                            childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(
                                    getMeasuredHeight(),
                                    MeasureSpec.AT_MOST);
                        } else if (layoutParams.height == ViewGroup.LayoutParams.WRAP_CONTENT) {
                            childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(
                                    0,
                                    MeasureSpec.UNSPECIFIED);
                        } else {
                            childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(
                                    layoutParams.height,
                                    MeasureSpec.EXACTLY);
                        }
                        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                        YogaNode node = getYogaNodeForView(child);
                        if (!(child instanceof YogaLayout) && node != null) {
                            JSObject flexConfig = childNode.getFlexConfig();
                            YogaUnit widthUnit = YogaUnit.AUTO;
                            YogaUnit heightUnit = YogaUnit.AUTO;
                            if (flexConfig != null) {
                                JSValue widthValue = flexConfig.getProperty("width");
                                if (widthValue.isNumber()) {
                                    widthUnit = YogaUnit.POINT;
                                } else if (widthValue.isObject()) {
                                    JSValue typeValue = widthValue.asObject().getProperty("type");
                                    if (typeValue.isNumber()) {
                                        widthUnit = YogaUnit.fromInt(typeValue.asNumber().toInt());
                                    }
                                }
                                JSValue heightValue = flexConfig.getProperty("height");
                                if (heightValue.isNumber()) {
                                    heightUnit = YogaUnit.POINT;
                                } else if (heightValue.isObject()) {
                                    JSValue typeValue = heightValue.asObject().getProperty("type");
                                    if (typeValue.isNumber()) {
                                        heightUnit = YogaUnit.fromInt(typeValue.asNumber().toInt());
                                    }
                                }
                            }
                            if (widthUnit == YogaUnit.AUTO) {
                                node.setWidth(childNode.getView().getMeasuredWidth());
                            }
                            if (heightUnit == YogaUnit.AUTO) {
                                node.setHeight(childNode.getView().getMeasuredHeight());
                            }
                        }
                    }
                }
                YogaUnit widthUnit = YogaUnit.AUTO;
                YogaUnit heightUnit = YogaUnit.AUTO;
                JSObject flexConfig = getFlexConfig();
                if (flexConfig != null) {
                    JSValue widthValue = flexConfig.getProperty("width");
                    if (widthValue.isNumber()) {
                        widthUnit = YogaUnit.POINT;
                    } else if (widthValue.isObject()) {
                        JSValue typeValue = widthValue.asObject().getProperty("type");
                        if (typeValue.isNumber()) {
                            widthUnit = YogaUnit.fromInt(typeValue.asNumber().toInt());
                        }
                    }
                    JSValue heightValue = flexConfig.getProperty("height");
                    if (heightValue.isNumber()) {
                        heightUnit = YogaUnit.POINT;
                    } else if (heightValue.isObject()) {
                        JSValue typeValue = heightValue.asObject().getProperty("type");
                        if (typeValue.isNumber()) {
                            heightUnit = YogaUnit.fromInt(typeValue.asNumber().toInt());
                        }
                    }
                }
                // Because in onLayout yogaNode's width and height would be set to exactly.
                if (widthUnit == YogaUnit.AUTO) {
                    getYogaNode().setWidthAuto();
                }
                if (heightUnit == YogaUnit.AUTO) {
                    getYogaNode().setHeightAuto();
                }
                if (!(getParent() instanceof YogaLayout)) {
                    final int widthSize = MeasureSpec.getSize(widthMeasureSpec);
                    final int heightSize = MeasureSpec.getSize(heightMeasureSpec);
                    final int widthMode = MeasureSpec.getMode(widthMeasureSpec);
                    final int heightMode = MeasureSpec.getMode(heightMeasureSpec);
                    if (widthMode == MeasureSpec.AT_MOST) {
                        widthMeasureSpec = MeasureSpec.makeMeasureSpec(widthSize, MeasureSpec.UNSPECIFIED);
                    }
                    if (heightMode == MeasureSpec.AT_MOST) {
                        heightMeasureSpec = MeasureSpec.makeMeasureSpec(heightSize, MeasureSpec.UNSPECIFIED);
                    }
                }

                super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            }
        };
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new YogaLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode<?> viewNode, JSObject jsObject) {
        super.blendSubLayoutConfig(viewNode, jsObject);
    }

    @Override
    protected void blend(YogaLayout view, String name, JSValue prop) {
        if ("flexConfig".equals(name)) {
            blendSubFlexConfig(mView.getYogaNode(), prop.asObject());
            this.mFlexConfig = prop.asObject();
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        for (ViewNode<?> childNode : mChildNodes) {
            YogaNode yogaNode = this.mView.getYogaNodeForView(childNode.getNodeView());
            if (yogaNode != null) {
                blendSubFlexConfig(yogaNode, childNode.getFlexConfig());
            }
        }
    }

    private void blendSubFlexConfig(YogaNode yogaNode, JSObject jsObject) {
        if (jsObject != null) {
            for (String name : jsObject.propertySet()) {
                JSValue value = jsObject.getProperty(name);
                blendFlexConfig(yogaNode, name, value);
            }
        }
    }

    private void blendFlexConfig(final YogaNode yogaNode, String name, JSValue value) {
        switch (name) {
            case "direction":
                yogaNode.setDirection(YogaDirection.fromInt(value.asNumber().toInt()));
                break;
            case "flexDirection":
                yogaNode.setFlexDirection(YogaFlexDirection.fromInt(value.asNumber().toInt()));
                break;
            case "justifyContent":
                yogaNode.setJustifyContent(YogaJustify.fromInt(value.asNumber().toInt()));
                break;
            case "alignContent":
                yogaNode.setAlignContent(YogaAlign.fromInt(value.asNumber().toInt()));
                break;
            case "alignItems":
                yogaNode.setAlignItems(YogaAlign.fromInt(value.asNumber().toInt()));
                break;
            case "alignSelf":
                yogaNode.setAlignSelf(YogaAlign.fromInt(value.asNumber().toInt()));
                break;
            case "positionType":
                yogaNode.setPositionType(YogaPositionType.fromInt(value.asNumber().toInt()));
                break;
            case "flexWrap":
                yogaNode.setWrap(YogaWrap.fromInt(value.asNumber().toInt()));
                break;
            case "overFlow":
                yogaNode.setOverflow(YogaOverflow.fromInt(value.asNumber().toInt()));
                break;
            case "display":
                yogaNode.setDisplay(YogaDisplay.fromInt(value.asNumber().toInt()));
                break;
            case "flex":
                yogaNode.setFlex(value.asNumber().toFloat());
                break;
            case "flexGrow":
                yogaNode.setFlexGrow(value.asNumber().toFloat());
                break;
            case "flexShrink":
                yogaNode.setFlexShrink(value.asNumber().toFloat());
                break;
            case "flexBasis":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setFlexBasis(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setFlexBasisPercent(v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setFlexBasisAuto();
                    }
                });
                break;
            case "marginLeft":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.LEFT, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.LEFT, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.LEFT);
                    }
                });
                break;
            case "marginRight":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.RIGHT, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.RIGHT, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.RIGHT);
                    }
                });
                break;
            case "marginTop":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.TOP, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.TOP, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.TOP);
                    }
                });
                break;
            case "marginBottom":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.BOTTOM, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.BOTTOM, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.BOTTOM);
                    }
                });
                break;
            case "marginStart":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.START, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.START, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.START);
                    }
                });
                break;
            case "marginEnd":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.END, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.END, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.END);
                    }
                });
                break;
            case "marginHorizontal":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.HORIZONTAL, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.HORIZONTAL, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.HORIZONTAL);
                    }
                });
                break;
            case "marginVertical":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.VERTICAL, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.VERTICAL, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.VERTICAL);
                    }
                });
                break;
            case "margin":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMargin(YogaEdge.ALL, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMarginPercent(YogaEdge.ALL, v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setMarginAuto(YogaEdge.ALL);
                    }
                });
                break;


            case "paddingLeft":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.LEFT, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.LEFT, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingRight":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.RIGHT, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.RIGHT, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingTop":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.TOP, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.TOP, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingBottom":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.BOTTOM, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.BOTTOM, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingStart":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.START, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.START, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingEnd":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.END, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.END, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingHorizontal":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.HORIZONTAL, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.HORIZONTAL, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "paddingVertical":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.VERTICAL, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.VERTICAL, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "padding":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPadding(YogaEdge.ALL, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPaddingPercent(YogaEdge.ALL, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "borderLeftWidth":
                yogaNode.setBorder(YogaEdge.LEFT, value.asNumber().toFloat());
                break;
            case "borderRightWidth":
                yogaNode.setBorder(YogaEdge.RIGHT, value.asNumber().toFloat());
                break;
            case "borderTopWidth":
                yogaNode.setBorder(YogaEdge.TOP, value.asNumber().toFloat());
                break;
            case "borderBottomWidth":
                yogaNode.setBorder(YogaEdge.BOTTOM, value.asNumber().toFloat());
                break;
            case "borderStartWidth":
                yogaNode.setBorder(YogaEdge.START, value.asNumber().toFloat());
                break;
            case "borderEndWidth":
                yogaNode.setBorder(YogaEdge.END, value.asNumber().toFloat());
                break;
            case "borderWidth":
                yogaNode.setBorder(YogaEdge.ALL, value.asNumber().toFloat());
                break;
            case "left":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPosition(YogaEdge.LEFT, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPositionPercent(YogaEdge.LEFT, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "right":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPosition(YogaEdge.RIGHT, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPositionPercent(YogaEdge.RIGHT, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "top":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPosition(YogaEdge.TOP, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPositionPercent(YogaEdge.TOP, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "bottom":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPosition(YogaEdge.BOTTOM, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPositionPercent(YogaEdge.BOTTOM, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "start":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPosition(YogaEdge.START, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPositionPercent(YogaEdge.START, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "end":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setPosition(YogaEdge.END, v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setPositionPercent(YogaEdge.END, v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "width":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setWidth(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setWidthPercent(v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setWidthAuto();
                    }
                });
                break;
            case "height":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setHeight(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setHeightPercent(v);
                    }

                    @Override
                    public void setAuto() {
                        yogaNode.setHeightAuto();
                    }
                });
                break;
            case "minWidth":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMinWidth(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMinHeightPercent(v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "minHeight":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMinHeight(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMinHeightPercent(v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "maxWidth":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMaxWidth(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMaxWidthPercent(v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "maxHeight":
                setYogaValue(value, new YogaSetting() {
                    @Override
                    public void setPoint(float v) {
                        yogaNode.setMaxHeight(v);
                    }

                    @Override
                    public void setPercent(float v) {
                        yogaNode.setMaxHeightPercent(v);
                    }

                    @Override
                    public void setAuto() {
                    }
                });
                break;
            case "aspectRatio":
                yogaNode.setAspectRatio(value.asNumber().toFloat());
                break;
            default:
                DoricLog.e("Cannot find flex config", name);
                break;
        }
    }

    private interface YogaSetting {
        void setPoint(float v);

        void setPercent(float v);

        void setAuto();
    }

    private void setYogaValue(JSValue value, YogaSetting setting) {
        if (value.isNumber()) {
            setting.setPoint(DoricUtils.dp2px(value.asNumber().toFloat()));
        } else if (value.isObject()) {
            JSValue jsType = value.asObject().getProperty("type");
            JSValue jsValue = value.asObject().getProperty("value");
            if (jsType.isNumber()) {
                switch (jsType.asNumber().toInt()) {
                    case FLEX_VALUE_TYPE_POINT:
                        setting.setPoint(DoricUtils.dp2px(jsValue.asNumber().toFloat()));
                        break;
                    case FLEX_VALUE_TYPE_PERCENT:
                        setting.setPercent(jsValue.asNumber().toFloat());
                        break;
                    default:
                        setting.setAuto();
                        break;
                }
            }
        }
    }
}
