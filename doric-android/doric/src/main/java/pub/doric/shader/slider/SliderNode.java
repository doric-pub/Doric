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
package pub.doric.shader.slider;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Rect;
import android.text.TextUtils;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.LinearSmoothScroller;
import androidx.recyclerview.widget.PagerSnapHelper;
import androidx.recyclerview.widget.RecyclerView;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.shader.slider
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-19
 */
@DoricPlugin(name = "Slider")
public class SliderNode extends SuperNode<RecyclerView> {
    private final SlideAdapter slideAdapter;
    private String onPageSlidedFuncId;
    private int lastPosition = 0;
    private int itemCount = 0;
    private boolean loop = false;
    private String renderPageFuncId;
    private boolean scrollable = true;
    String slideStyle = null;
    private float minScale = 0.618f;
    private float maxScale = 1;
    private float galleryItemWidth = -1f;

    private int slidePosition;
    private boolean needSlideToPosition;

    private PagerSnapHelper snapHelper;

    public SliderNode(DoricContext doricContext) {
        super(doricContext);
        this.slideAdapter = new SlideAdapter(this);
    }

    @Override
    protected RecyclerView build() {
        final RecyclerView recyclerView = new RecyclerView(getContext());

        final SliderLayoutManager layoutManager = new SliderLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false) {
            @Override
            public boolean canScrollHorizontally() {
                if (!scrollable) {
                    return false;
                }
                return super.canScrollHorizontally();
            }

            @Override
            public void smoothScrollToPosition(RecyclerView recyclerView, RecyclerView.State state, int position) {
                if (scrollable) {
                    super.smoothScrollToPosition(recyclerView, state, position);
                } else {
                    DoricLinearSmoothScroller linearSmoothScroller = new DoricLinearSmoothScroller(recyclerView.getContext());
                    linearSmoothScroller.setTargetPosition(position);
                    startSmoothScroll(linearSmoothScroller);
                }
            }
        };

        recyclerView.setLayoutManager(layoutManager);
        snapHelper = new PagerSnapHelper();
        snapHelper.attachToRecyclerView(recyclerView);

        recyclerView.addItemDecoration(new RecyclerView.ItemDecoration() {
            @Override
            public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
                if ("gallery".equals(slideStyle)) {
                    int position = parent.getChildAdapterPosition(view);

                    LinearLayoutManager layoutManager = (LinearLayoutManager) parent.getLayoutManager();
                    assert layoutManager != null;
                    int count = layoutManager.getItemCount();
                    int interval = (recyclerView.getWidth() - DoricUtils.dp2px(SliderNode.this.galleryItemWidth)) / 2;
                    if (position == 0) {
                        outRect.left = interval;
                    } else if (position == count - 1) {
                        outRect.right = interval;
                    }
                } else {
                    super.getItemOffsets(outRect, view, parent, state);
                }
            }
        });
        recyclerView.setAdapter(this.slideAdapter);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                    View view = snapHelper.findSnapView(layoutManager);
                    if (view != null) {
                        int position = layoutManager.getPosition(view);

                        if (slideAdapter.loop) {
                            if (position == 0) {
                                recyclerView.scrollToPosition(slideAdapter.itemCount);

                                position = slideAdapter.itemCount - 1;
                            } else if (position == slideAdapter.itemCount + 1) {
                                recyclerView.scrollToPosition(1);

                                position = 0;
                            } else {
                                position = position - 1;
                            }
                        }

                        if (!TextUtils.isEmpty(onPageSlidedFuncId)) {
                            if (position != lastPosition) {
                                callJSResponse(onPageSlidedFuncId, position);
                            }
                            lastPosition = position;
                        }
                    }
                }
            }

            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                if ("zoomOut".equals(slideStyle)) {
                    final int childCount = recyclerView.getChildCount();
                    for (int i = 0; i < childCount; i++) {
                        View child = recyclerView.getChildAt(i);
                        RecyclerView.LayoutParams lp = (RecyclerView.LayoutParams) child.getLayoutParams();
                        if (child.getWidth() == 0) {
                            return;
                        }
                        float centerX = recyclerView.getWidth() / 2.f;
                        float vCenterX = (child.getLeft() + child.getRight()) / 2.f;
                        float percent = 1 - Math.abs(centerX - vCenterX) / centerX;
                        float scaleFactor = minScale + Math.abs(percent) * (maxScale - minScale);
                        child.setLayoutParams(lp);
                        child.setScaleY(scaleFactor);
                        child.setScaleX(scaleFactor);
                    }
                }
            }
        });
        return recyclerView;
    }

    @Override
    public ViewNode<?> getSubNodeById(String id) {
        RecyclerView.LayoutManager manager = mView.getLayoutManager();
        if (manager == null) {
            return null;
        }
        for (int i = 0; i < manager.getChildCount(); i++) {
            View view = manager.getChildAt(i);
            if (view == null) {
                continue;
            }
            SlideAdapter.DoricViewHolder viewHolder = (SlideAdapter.DoricViewHolder) mView.getChildViewHolder(view);
            if (id.equals(viewHolder.slideItemNode.getId())) {
                return viewHolder.slideItemNode;
            }
        }
        return null;
    }

    @Override
    protected void blendSubNode(JSObject subProperties) {
        String viewId = subProperties.getProperty("id").asString().value();
        ViewNode<?> node = getSubNodeById(viewId);
        JSObject oldModel = getSubModel(viewId);
        if (oldModel != null) {
            recursiveMixin(subProperties, oldModel);
        }
        if (node != null) {
            node.blend(subProperties.getProperty("props").asObject());
        } else {
            slideAdapter.blendSubNode(subProperties);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);

        final boolean needToScroll = (loop && !slideAdapter.loop)
                || (!renderPageFuncId.equals(slideAdapter.renderPageFuncId))
                || (slideAdapter.itemCount == 0 && itemCount > 0)
                || needSlideToPosition;

        // If reset renderItem,should reset native cache.
        if (!renderPageFuncId.equals(slideAdapter.renderPageFuncId)) {
            slideAdapter.itemValues.clear();
            clearSubModel();
            slideAdapter.renderPageFuncId = renderPageFuncId;
        }

        slideAdapter.loop = loop;
        if (jsObject.propertySet().size() > 1 || !jsObject.propertySet().contains("subviews")) {
            if (mView != null) {
                mView.post(new Runnable() {
                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void run() {
                        slideAdapter.itemCount = itemCount;
                        slideAdapter.notifyDataSetChanged();
                        if (needToScroll) {
                            mView.post(new Runnable() {
                                @Override
                                public void run() {
                                    int position = (slideAdapter.loop ? 1 : 0) + SliderNode.this.slidePosition;
                                    mView.scrollToPosition(position);

                                    needSlideToPosition = false;
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    @Override
    protected void blend(RecyclerView view, String name, JSValue prop) {
        switch (name) {
            case "scrollable":
                if (!prop.isBoolean()) {
                    return;
                }
                this.scrollable = prop.asBoolean().value();
                break;
            case "itemCount":
                this.itemCount = prop.asNumber().toInt();
                break;
            case "renderPage":
                this.renderPageFuncId = prop.asString().value();
                break;
            case "batchCount":
                this.slideAdapter.batchCount = prop.asNumber().toInt();
                break;
            case "onPageSlided":
                this.onPageSlidedFuncId = prop.asString().toString();
                break;
            case "loop":
                this.loop = prop.asBoolean().value();
                break;
            case "slideStyle":
                if (prop.isString()) {
                    this.slideStyle = prop.asString().value();
                } else if (prop.isObject()) {
                    this.slideStyle = prop.asObject().getProperty("type").asString().value();
                    if (this.slideStyle.equals("zoomOut")) {
                        this.maxScale = prop.asObject().getProperty("maxScale").asNumber().toFloat();
                        this.minScale = prop.asObject().getProperty("minScale").asNumber().toFloat();
                    } else if (this.slideStyle.equals("gallery")) {
                        float galleryMinScale = prop.asObject().getProperty("minScale").asNumber().toFloat();
                        float galleryMinAlpha = prop.asObject().getProperty("minAlpha").asNumber().toFloat();
                        this.galleryItemWidth = prop.asObject().getProperty("itemWidth").asNumber().toFloat();

                        SliderLayoutManager layoutManager = (SliderLayoutManager) mView.getLayoutManager();
                        if (layoutManager != null) {
                            layoutManager.setEnableGallery(true);
                            layoutManager.setMinScale(galleryMinScale);
                            layoutManager.setMinAlpha(galleryMinAlpha);
                            layoutManager.setItemWidth(this.galleryItemWidth);
                            this.slideAdapter.setItemWidth(this.galleryItemWidth);
                        }

                    }
                }
                break;
            case "slidePosition":
                if (prop.isNumber()) {
                    int newSlidePosition = prop.asNumber().toInt();
                    if (this.slidePosition == newSlidePosition) {

                    } else {
                        needSlideToPosition = true;
                    }
                    this.slidePosition = newSlidePosition;
                }
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @DoricMethod
    public void slidePage(JSObject params, DoricPromise promise) {
        int page = params.getProperty("page").asNumber().toInt();
        boolean smooth = params.getProperty("smooth").asBoolean().value();
        if (smooth) {
            if (slideAdapter.loop) {
                mView.smoothScrollToPosition(page + 1);
            } else {
                mView.smoothScrollToPosition(page);
            }

        } else {
            if (slideAdapter.loop) {
                mView.scrollToPosition(page + 1);
            } else {
                mView.scrollToPosition(page);
            }

            if ("gallery".equals(slideStyle)) {
                mView.post(new Runnable() {
                    @Override
                    public void run() {
                        View snapView = snapHelper.findSnapView(mView.getLayoutManager());
                        if (snapView != null) {
                            int[] distance = snapHelper.calculateDistanceToFinalSnap(mView.getLayoutManager(), snapView);
                            mView.smoothScrollBy(distance[0], distance[1]);
                        }
                    }
                });
            }

        }
        if (!TextUtils.isEmpty(onPageSlidedFuncId)) {
            callJSResponse(onPageSlidedFuncId, page);
            lastPosition = page;
        }
        promise.resolve();
    }

    @DoricMethod
    public int getSlidedPage() {
        LinearLayoutManager linearLayoutManager = (LinearLayoutManager) mView.getLayoutManager();
        int pageIndex = linearLayoutManager != null ? linearLayoutManager.findFirstVisibleItemPosition() : 0;
        if (slideAdapter.loop) {
            return pageIndex - 1;
        } else {
            return pageIndex;
        }
    }


    @DoricMethod
    public void reload() {
        slideAdapter.itemValues.clear();
        clearSubModel();
        mView.post(new Runnable() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void run() {
                slideAdapter.notifyDataSetChanged();
            }
        });
    }


    @Override
    public void reset() {
        super.reset();
        scrollable = true;
        onPageSlidedFuncId = null;
        renderPageFuncId = null;
        slideStyle = null;
        minScale = .618f;
        maxScale = 1.f;
        slidePosition = 0;
    }

    private static class DoricLinearSmoothScroller extends LinearSmoothScroller {

        public DoricLinearSmoothScroller(Context context) {
            super(context);
        }

        @Override
        public int calculateDxToMakeVisible(View view, int snapPreference) {
            final RecyclerView.LayoutManager layoutManager = getLayoutManager();
            if (layoutManager == null) {
                return 0;
            }
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
                    view.getLayoutParams();
            final int left = layoutManager.getDecoratedLeft(view) - params.leftMargin;
            final int right = layoutManager.getDecoratedRight(view) + params.rightMargin;
            final int start = layoutManager.getPaddingLeft();
            final int end = layoutManager.getWidth() - layoutManager.getPaddingRight();
            return calculateDtToFit(left, right, start, end, snapPreference);
        }
    }
}
