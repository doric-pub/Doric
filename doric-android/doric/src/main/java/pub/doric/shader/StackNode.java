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
import android.graphics.drawable.Drawable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.utils.DoricUtils;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.ArrayList;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Stack")
public class StackNode extends GroupNode<FrameLayout> {
    private static class MaximumFrameLayout extends FrameLayout {
        private int maxWidth = Integer.MAX_VALUE;
        private int maxHeight = Integer.MAX_VALUE;
        private final ArrayList<View> mMatchParentChildren = new ArrayList<>(1);

        public MaximumFrameLayout(Context context) {
            super(context);
        }

        int getPaddingLeftWithForeground() {
            return getPaddingLeft();
        }

        int getPaddingRightWithForeground() {
            return getPaddingRight();
        }

        private int getPaddingTopWithForeground() {
            return getPaddingTop();
        }

        private int getPaddingBottomWithForeground() {
            return getPaddingBottom();
        }

        private void rawOnMeasure(int widthMeasureSpec, int heightMeasureSpec) {
            int count = getChildCount();

            final boolean measureMatchParentChildren =
                    MeasureSpec.getMode(widthMeasureSpec) != MeasureSpec.EXACTLY ||
                            MeasureSpec.getMode(heightMeasureSpec) != MeasureSpec.EXACTLY;
            mMatchParentChildren.clear();

            int maxHeight = 0;
            int maxWidth = 0;
            int childState = 0;

            for (int i = 0; i < count; i++) {
                final View child = getChildAt(i);
                if (getMeasureAllChildren() || child.getVisibility() != GONE) {
                    measureChildWithMargins(child, widthMeasureSpec, 0, heightMeasureSpec, 0);
                    final LayoutParams lp = (LayoutParams) child.getLayoutParams();
                    maxWidth = Math.max(maxWidth,
                            child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);
                    maxHeight = Math.max(maxHeight,
                            child.getMeasuredHeight() + lp.topMargin + lp.bottomMargin);
                    childState = combineMeasuredStates(childState, child.getMeasuredState());
                    if (measureMatchParentChildren) {
                        if (lp.width == LayoutParams.MATCH_PARENT ||
                                lp.height == LayoutParams.MATCH_PARENT) {
                            mMatchParentChildren.add(child);
                        }
                    }
                }
            }

            // Account for padding too
            maxWidth += getPaddingLeftWithForeground() + getPaddingRightWithForeground();
            maxHeight += getPaddingTopWithForeground() + getPaddingBottomWithForeground();

            // Check against our minimum height and width
            maxHeight = Math.max(maxHeight, getSuggestedMinimumHeight());
            maxWidth = Math.max(maxWidth, getSuggestedMinimumWidth());

            // Check against our foreground's minimum height and width
            final Drawable drawable = getForeground();
            if (drawable != null) {
                maxHeight = Math.max(maxHeight, drawable.getMinimumHeight());
                maxWidth = Math.max(maxWidth, drawable.getMinimumWidth());
            }

            setMeasuredDimension(resolveSizeAndState(maxWidth, widthMeasureSpec, childState),
                    resolveSizeAndState(maxHeight, heightMeasureSpec,
                            childState << MEASURED_HEIGHT_STATE_SHIFT));

            count = mMatchParentChildren.size();
            if (count > 0) {
                for (int i = 0; i < count; i++) {
                    final View child = mMatchParentChildren.get(i);
                    final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

                    final int childWidthMeasureSpec;
                    if (lp.width == LayoutParams.MATCH_PARENT) {
                        final int width = Math.max(0, getMeasuredWidth()
                                - getPaddingLeftWithForeground() - getPaddingRightWithForeground()
                                - lp.leftMargin - lp.rightMargin);
                        childWidthMeasureSpec = MeasureSpec.makeMeasureSpec(
                                width, MeasureSpec.EXACTLY);
                    } else {
                        childWidthMeasureSpec = getChildMeasureSpec(widthMeasureSpec,
                                getPaddingLeftWithForeground() + getPaddingRightWithForeground() +
                                        lp.leftMargin + lp.rightMargin,
                                lp.width);
                    }

                    final int childHeightMeasureSpec;
                    if (lp.height == LayoutParams.MATCH_PARENT) {
                        final int height = Math.max(0, getMeasuredHeight()
                                - getPaddingTopWithForeground() - getPaddingBottomWithForeground()
                                - lp.topMargin - lp.bottomMargin);
                        childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(
                                height, MeasureSpec.EXACTLY);
                    } else {
                        childHeightMeasureSpec = getChildMeasureSpec(heightMeasureSpec,
                                getPaddingTopWithForeground() + getPaddingBottomWithForeground() +
                                        lp.topMargin + lp.bottomMargin,
                                lp.height);
                    }

                    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                }
            }
        }


        @Override
        protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
            rawOnMeasure(widthMeasureSpec, heightMeasureSpec);
            int width = getMeasuredWidth();
            int height = getMeasuredHeight();
            if (width > maxWidth || height > maxHeight) {
                width = Math.min(width, maxWidth);
                height = Math.min(height, maxHeight);
                widthMeasureSpec = MeasureSpec.makeMeasureSpec(width, MeasureSpec.AT_MOST);
                heightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.AT_MOST);
                rawOnMeasure(widthMeasureSpec, heightMeasureSpec);
            }
        }
    }


    public StackNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blendLayoutConfig(JSObject jsObject) {
        super.blendLayoutConfig(jsObject);
        JSValue maxWidth = jsObject.getProperty("maxWidth");
        if (maxWidth.isNumber()) {
            ((MaximumFrameLayout) mView).maxWidth = DoricUtils.dp2px(maxWidth.asNumber().toFloat());
        }
        JSValue maxHeight = jsObject.getProperty("maxHeight");
        if (maxHeight.isNumber()) {
            ((MaximumFrameLayout) mView).maxHeight = DoricUtils.dp2px(maxHeight.asNumber().toFloat());
        }
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject jsObject) {
        super.blendSubLayoutConfig(viewNode, jsObject);
        JSValue jsValue = jsObject.getProperty("alignment");
        if (jsValue.isNumber()) {
            ((FrameLayout.LayoutParams) viewNode.getLayoutParams()).gravity = jsValue.asNumber().toInt();
        }
    }

    @Override
    protected FrameLayout build() {
        return new MaximumFrameLayout(getContext());
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        super.blend(view, name, prop);
    }

    @Override
    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new FrameLayout.LayoutParams(0, 0);
    }
}
