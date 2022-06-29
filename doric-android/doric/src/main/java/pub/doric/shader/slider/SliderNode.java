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

/**
 * @Description: pub.doric.shader.slider
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-19
 * @UpdateDate: 2020-04-09
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

    public SliderNode(DoricContext doricContext) {
        super(doricContext);
        this.slideAdapter = new SlideAdapter(this);
    }

    @Override
    protected RecyclerView build() {
        RecyclerView recyclerView = new RecyclerView(getContext());


        final LinearLayoutManager layoutManager = new LinearLayoutManager(getContext()) {
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

        layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);
        recyclerView.setLayoutManager(layoutManager);
        final PagerSnapHelper snapHelper = new PagerSnapHelper();
        snapHelper.attachToRecyclerView(recyclerView);
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
            }
        });
        return recyclerView;
    }

    @Override
    public ViewNode getSubNodeById(String id) {
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
        ViewNode node = getSubNodeById(viewId);
        if (node != null) {
            node.blend(subProperties.getProperty("props").asObject());
        } else {
            JSObject oldModel = getSubModel(viewId);
            if (oldModel != null) {
                recursiveMixin(subProperties, oldModel);
            }
            slideAdapter.blendSubNode(subProperties);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);

        final boolean needToScroll = (loop && !slideAdapter.loop)
                || (!renderPageFuncId.equals(slideAdapter.renderPageFuncId))
                || (slideAdapter.itemCount == 0 && itemCount > 0);

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
                                    int position = slideAdapter.loop ? 1 : 0;
                                    mView.scrollToPosition(position);
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

    @Override
    public void reset() {
        super.reset();
        scrollable = true;
        onPageSlidedFuncId = null;
        renderPageFuncId = null;
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
