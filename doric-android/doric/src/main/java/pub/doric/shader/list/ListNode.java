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
package pub.doric.shader.list;

import android.text.TextUtils;
import android.util.SparseArray;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSNumber;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.DoricScrollChangeListener;
import pub.doric.IDoricScrollable;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricJSDispatcher;
import pub.doric.utils.DoricUtils;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
@DoricPlugin(name = "List")
public class ListNode extends SuperNode<RecyclerView> implements IDoricScrollable {
    private final ListAdapter listAdapter;
    private String renderItemFuncId;
    String onLoadMoreFuncId;
    int itemCount = 0;
    int batchCount = 15;
    SparseArray<String> itemValues = new SparseArray<>();
    boolean loadMore = false;
    String loadMoreViewId;
    private final Set<DoricScrollChangeListener> listeners = new HashSet<>();
    private String onScrollFuncId;
    private String onScrollEndFuncId;
    private final DoricJSDispatcher jsDispatcher = new DoricJSDispatcher();

    public ListNode(DoricContext doricContext) {
        super(doricContext);
        this.listAdapter = new ListAdapter(this);
    }

    private boolean scrollable = true;

    @Override
    protected void blendSubNode(JSObject subProperties) {
        String viewId = subProperties.getProperty("id").asString().value();
        ViewNode<?> node = getSubNodeById(viewId);
        if (node != null) {
            node.blend(subProperties.getProperty("props").asObject());
        } else {
            JSObject oldModel = getSubModel(viewId);
            if (oldModel != null) {
                recursiveMixin(subProperties, oldModel);
            }
            listAdapter.blendSubNode(subProperties);
        }
    }

    @Override
    protected RecyclerView build() {
        final RecyclerView recyclerView = new RecyclerView(getContext());
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()) {
            @Override
            public boolean canScrollVertically() {
                if (!scrollable) {
                    return false;
                }
                return super.canScrollVertically();
            }
        });
        recyclerView.setAdapter(this.listAdapter);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                final int offsetX = recyclerView.computeHorizontalScrollOffset();
                final int offsetY = recyclerView.computeVerticalScrollOffset();
                for (DoricScrollChangeListener listener : listeners) {
                    listener.onScrollChange(recyclerView, offsetX, offsetY, offsetX - dx, offsetY - dy);
                }
                if (!TextUtils.isEmpty(onScrollFuncId)) {
                    jsDispatcher.dispatch(new Callable<AsyncResult<JSDecoder>>() {
                        @Override
                        public AsyncResult<JSDecoder> call() {
                            return callJSResponse(onScrollFuncId, new JSONBuilder()
                                    .put("x", DoricUtils.px2dp(offsetX))
                                    .put("y", DoricUtils.px2dp(offsetY))
                                    .toJSONObject());
                        }
                    });
                }
            }

            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                    if (!TextUtils.isEmpty(onScrollEndFuncId)) {
                        int offsetX = recyclerView.computeHorizontalScrollOffset();
                        int offsetY = recyclerView.computeVerticalScrollOffset();
                        callJSResponse(
                                onScrollEndFuncId,
                                new JSONBuilder()
                                        .put("x", DoricUtils.px2dp(offsetX))
                                        .put("y", DoricUtils.px2dp(offsetY))
                                        .toJSONObject());
                    }
                }
            }
        });
        final GestureDetector gestureDetector = new GestureDetector(
                getContext(),
                new GestureDetector.SimpleOnGestureListener() {
                    @Override
                    public void onLongPress(MotionEvent e) {
                        super.onLongPress(e);
                        View childView = recyclerView.findChildViewUnder(e.getX(), e.getY());
                        if (childView != null) {
                            int position = recyclerView.getChildLayoutPosition(childView);
                            listAdapter.onItemLongClick(position, childView);
                        }
                    }
                });

        recyclerView.addOnItemTouchListener(new RecyclerView.SimpleOnItemTouchListener() {
            @Override
            public boolean onInterceptTouchEvent(@NonNull RecyclerView rv, @NonNull MotionEvent e) {
                return gestureDetector.onTouchEvent(e);
            }
        });
        return recyclerView;
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        if (mView != null) {
            mView.post(new Runnable() {
                @Override
                public void run() {
                    listAdapter.setItemCount(itemCount + (loadMore ? 1 : 0));
                    listAdapter.notifyDataSetChanged();
                }
            });
        }
    }

    @Override
    protected void blend(RecyclerView view, String name, final JSValue prop) {
        switch (name) {
            case "scrollable":
                if (!prop.isBoolean()) {
                    return;
                }
                this.scrollable = prop.asBoolean().value();
                break;
            case "itemCount":
                if (!prop.isNumber()) {
                    return;
                }
                this.itemCount = prop.asNumber().toInt();
                break;
            case "renderItem":
                if (!prop.isString()) {
                    return;
                }
                String funcId = prop.asString().value();
                if (!funcId.equals(this.renderItemFuncId)) {
                    this.renderItemFuncId = funcId;
                    // If reset renderItem,should reset native cache.
                    for (int index = 0; index < this.itemValues.size(); index++) {
                        removeSubModel(this.itemValues.valueAt(index));
                    }
                    this.itemValues.clear();
                }
                break;
            case "onLoadMore":
                this.onLoadMoreFuncId = prop.asString().value();
                break;
            case "loadMoreView":
                this.loadMoreViewId = prop.asString().value();
                break;
            case "batchCount":
                this.batchCount = prop.asNumber().toInt();
                break;
            case "loadMore":
                this.loadMore = prop.asBoolean().value();
                break;
            case "onScroll":
                if (!prop.isString()) {
                    return;
                }
                this.onScrollFuncId = prop.asString().value();
                break;
            case "onScrollEnd":
                if (!prop.isString()) {
                    return;
                }
                this.onScrollEndFuncId = prop.asString().value();
                break;
            case "scrolledPosition":
                if (!prop.isNumber()) {
                    return;
                }
                view.post(new Runnable() {
                    @Override
                    public void run() {
                        moveToPosition(prop.asNumber().toInt(), false);
                    }
                });
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode<?> viewNode, JSObject jsObject) {
        super.blendSubLayoutConfig(viewNode, jsObject);
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
            ListAdapter.DoricViewHolder viewHolder = (ListAdapter.DoricViewHolder) mView.getChildViewHolder(view);
            if (id.equals(viewHolder.listItemNode.getId())) {
                return viewHolder.listItemNode;
            }
        }
        return null;
    }

    @Override
    public void addScrollChangeListener(DoricScrollChangeListener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeScrollChangeListener(DoricScrollChangeListener listener) {
        listeners.remove(listener);
    }

    @DoricMethod
    public void scrollToItem(JSObject params) {
        boolean animated = false;
        if (params.getProperty("animated").isBoolean()) {
            animated = params.getProperty("animated").asBoolean().value();
        }
        JSNumber pos = params.getProperty("index").asNumber();
        moveToPosition(pos.toInt(), animated);
    }

    private void moveToPosition(int pos, boolean smooth) {
        if (mView.getLayoutManager() == null) {
            return;
        }
        if (!(getView().getLayoutManager() instanceof LinearLayoutManager)) {
            defaultScrollTo(pos, smooth);
            return;
        }
        LinearLayoutManager layoutManager = (LinearLayoutManager) mView.getLayoutManager();
        int firstItem = layoutManager.findFirstVisibleItemPosition();
        int lastItem = layoutManager.findLastVisibleItemPosition();
        if (pos <= firstItem) {
            defaultScrollTo(pos, smooth);
        } else if (pos > lastItem) {
            defaultScrollTo(pos, smooth);
        }
    }


    private void defaultScrollTo(int pos, boolean b) {
        if (b) {
            mView.smoothScrollToPosition(pos);
        } else {
            mView.scrollToPosition(pos);
        }
    }

}
