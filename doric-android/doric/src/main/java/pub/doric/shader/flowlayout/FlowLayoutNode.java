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
package pub.doric.shader.flowlayout;

import static androidx.recyclerview.widget.ItemTouchHelper.ACTION_STATE_DRAG;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Rect;
import android.text.TextUtils;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearSmoothScroller;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import org.json.JSONArray;

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
 * @Description: pub.doric.shader.flowlayout
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-28
 */
@DoricPlugin(name = "FlowLayout")
public class FlowLayoutNode extends SuperNode<RecyclerView> implements IDoricScrollable {
    private final FlowAdapter flowAdapter;
    private final StaggeredGridLayoutManager staggeredGridLayoutManager = new StaggeredGridLayoutManager(
            2,
            StaggeredGridLayoutManager.VERTICAL) {
        @Override
        public int scrollVerticallyBy(int dy, RecyclerView.Recycler recycler, RecyclerView.State state) {
            try {
                return super.scrollVerticallyBy(dy, recycler, state);
            } catch (Exception e) {
                e.printStackTrace();
                return 0;
            }
        }

        @Override
        public void onScrollStateChanged(int state) {
            try {
                super.onScrollStateChanged(state);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public boolean canScrollVertically() {
            if (!scrollable) {
                return false;
            }
            return super.canScrollVertically();
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
    int columnSpace = 0;
    int rowSpace = 0;
    private final Rect padding = new Rect();
    private final RecyclerView.ItemDecoration spacingItemDecoration = new RecyclerView.ItemDecoration() {
        @Override
        public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
            outRect.set(columnSpace / 2, rowSpace / 2, columnSpace / 2, rowSpace / 2);
        }
    };
    String onLoadMoreFuncId;
    private boolean loadMore = false;
    String loadMoreViewId;
    private final Set<DoricScrollChangeListener> listeners = new HashSet<>();
    private String onScrollFuncId;
    private String onScrollEndFuncId;
    private final DoricJSDispatcher jsDispatcher = new DoricJSDispatcher();
    private int itemCount = 0;
    private boolean scrollable = true;
    private final Set<Integer> swapDisabled = new HashSet<>();

    private final DoricItemTouchHelperCallback doricItemTouchHelperCallback = new DoricItemTouchHelperCallback(
            new OnItemTouchCallbackListener() {
                @Override
                public void onSwiped(int adapterPosition) {

                }

                @Override
                public Boolean itemCanDrag(int fromPos) {
                    AsyncResult<JSDecoder> asyncResult = callJSResponse(itemCanDragFuncId, fromPos);
                    JSDecoder jsDecoder = asyncResult.synchronous().get();
                    try {
                        JSValue jsValue = jsDecoder.decode();
                        if (jsValue.isBoolean()) {
                            return jsValue.asBoolean().value();
                        }
                    } catch (ArchiveException e) {
                        e.printStackTrace();
                    }
                    return true;
                }

                @Override
                public void beforeMove(int fromPos) {
                    swapDisabled.clear();
                    if (!TextUtils.isEmpty(beforeDraggingFuncId)) {
                        AsyncResult<JSDecoder> asyncResult = callJSResponse(beforeDraggingFuncId, fromPos);
                        JSDecoder jsDecoder = asyncResult.synchronous().get();
                        try {
                            JSValue jsValue = jsDecoder.decode();
                            if (jsValue.isArray()) {
                                int[] intArray = jsValue.asArray().toIntArray();
                                for (int i = 0; i != intArray.length; i++) {
                                    swapDisabled.add(intArray[i]);
                                }
                            }
                        } catch (ArchiveException e) {
                            e.printStackTrace();
                        }
                    }
                }

                @Override
                public boolean onMove(int srcPosition, int targetPosition) {
                    if (swapDisabled.contains(targetPosition)) {
                        return false;
                    }
                    String srcValue = flowAdapter.itemValues.valueAt(srcPosition);
                    String targetValue = flowAdapter.itemValues.valueAt(targetPosition);
                    flowAdapter.itemValues.setValueAt(srcPosition, targetValue);
                    flowAdapter.itemValues.setValueAt(targetPosition, srcValue);
                    flowAdapter.notifyItemMoved(srcPosition, targetPosition);
                    if (!TextUtils.isEmpty(onDraggingFuncId)) {
                        callJSResponse(onDraggingFuncId, srcPosition, targetPosition);
                    }
                    return true;
                }

                @Override
                public void onMoved(int fromPos, int toPos) {
                    if (!TextUtils.isEmpty(onDraggedFuncId)) {
                        callJSResponse(onDraggedFuncId, fromPos, toPos);
                    }
                }
            }
    );

    private String itemCanDragFuncId;
    private String beforeDraggingFuncId;
    private String onDraggingFuncId;
    private String onDraggedFuncId;

    public FlowLayoutNode(DoricContext doricContext) {
        super(doricContext);
        this.flowAdapter = new FlowAdapter(this);
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
            FlowAdapter.DoricViewHolder viewHolder = (FlowAdapter.DoricViewHolder) mView.getChildViewHolder(view);
            if (id.equals(viewHolder.flowLayoutItemNode.getId())) {
                return viewHolder.flowLayoutItemNode;
            }
        }
        return null;
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
            case "columnSpace":
                if (!prop.isNumber()) {
                    return;
                }
                columnSpace = DoricUtils.dp2px(prop.asNumber().toFloat());
                break;
            case "rowSpace":
                if (!prop.isNumber()) {
                    return;
                }
                rowSpace = DoricUtils.dp2px(prop.asNumber().toFloat());
                break;
            case "columnCount":
                if (!prop.isNumber()) {
                    return;
                }
                staggeredGridLayoutManager.setSpanCount(prop.asNumber().toInt());
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
                if (!funcId.equals(this.flowAdapter.renderItemFuncId)) {
                    this.flowAdapter.loadAnchor = -1;
                    this.flowAdapter.renderItemFuncId = funcId;
                    // If reset renderItem,should reset native cache.
                    for (int index = 0; index < this.flowAdapter.itemValues.size(); index++) {
                        removeSubModel(this.flowAdapter.itemValues.valueAt(index));
                    }
                    this.flowAdapter.itemValues.clear();
                }
                break;
            case "batchCount":
                if (!prop.isNumber()) {
                    return;
                }
                this.flowAdapter.batchCount = prop.asNumber().toInt();
                break;
            case "onLoadMore":
                if (!prop.isString()) {
                    return;
                }
                this.onLoadMoreFuncId = prop.asString().value();
                break;
            case "loadMoreView":
                if (!prop.isString()) {
                    return;
                }
                this.loadMoreViewId = prop.asString().value();
                break;
            case "loadMore":
                if (!prop.isBoolean()) {
                    return;
                }
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
            case "canDrag":
                if (!prop.isBoolean()) {
                    return;
                }
                boolean canDrag = prop.asBoolean().value();
                doricItemTouchHelperCallback.setDragEnable(canDrag);
                break;
            case "itemCanDrag":
                if (!prop.isString()) {
                    return;
                }
                this.itemCanDragFuncId = prop.asString().value();
                break;
            case "beforeDragging":
                if (!prop.isString()) {
                    return;
                }
                this.beforeDraggingFuncId = prop.asString().value();
                break;
            case "onDragging":
                if (!prop.isString()) {
                    return;
                }
                this.onDraggingFuncId = prop.asString().value();
                break;
            case "onDragged":
                if (!prop.isString()) {
                    return;
                }
                this.onDraggedFuncId = prop.asString().value();
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @Override
    protected void setPadding(JSObject jsObject) {
        JSValue left = jsObject.getProperty("left");
        JSValue right = jsObject.getProperty("right");
        JSValue top = jsObject.getProperty("top");
        JSValue bottom = jsObject.getProperty("bottom");
        padding.left = left.isNumber() ? DoricUtils.dp2px(left.asNumber().toFloat()) : 0;
        padding.top = top.isNumber() ? DoricUtils.dp2px(top.asNumber().toFloat()) : 0;
        padding.right = right.isNumber() ? DoricUtils.dp2px(right.asNumber().toFloat()) : 0;
        padding.bottom = bottom.isNumber() ? DoricUtils.dp2px(bottom.asNumber().toFloat()) : 0;
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        mView.setPadding(
                padding.left - columnSpace / 2,
                padding.top - rowSpace / 2,
                padding.right - columnSpace / 2,
                padding.bottom - rowSpace / 2);
        if (jsObject.propertySet().size() > 1 || !jsObject.propertySet().contains("subviews")) {
            if (mView != null) {
                mView.post(new Runnable() {
                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void run() {
                        flowAdapter.loadMore = loadMore;
                        flowAdapter.itemCount = itemCount;
                        flowAdapter.notifyDataSetChanged();
                    }
                });
            }
        }
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
            flowAdapter.blendSubNode(subProperties);
        }
    }

    @Override
    protected RecyclerView build() {
        RecyclerView recyclerView = new RecyclerView(getContext());
        recyclerView.setLayoutManager(staggeredGridLayoutManager);
        recyclerView.setAdapter(flowAdapter);
        recyclerView.addItemDecoration(spacingItemDecoration);
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

        DoricItemTouchHelper doricItemTouchHelper = new DoricItemTouchHelper(doricItemTouchHelperCallback);

        doricItemTouchHelper.attachToRecyclerView(recyclerView);
        return recyclerView;
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
    public JSONArray findVisibleItems() {
        int[] firstPositions = staggeredGridLayoutManager.findFirstVisibleItemPositions(null);
        int[] lastPositions = staggeredGridLayoutManager.findLastVisibleItemPositions(null);
        JSONArray jsonArray = new JSONArray();
        int first = firstPositions[0];
        for (int firstPosition : firstPositions) {
            first = Math.min(first, firstPosition);
        }
        int last = lastPositions[0];
        for (int lastPosition : lastPositions) {
            last = Math.max(last, lastPosition);
        }
        for (int i = first; i <= last; i++) {
            jsonArray.put(i);
        }
        return jsonArray;
    }

    @DoricMethod
    public JSONArray findCompletelyVisibleItems() {
        int[] firstPositions = staggeredGridLayoutManager.findFirstVisibleItemPositions(null);
        int[] lastPositions = staggeredGridLayoutManager.findLastVisibleItemPositions(null);
        Set<Integer> positions = new HashSet<>();
        int first = firstPositions[0];
        for (int firstPosition : firstPositions) {
            first = Math.min(first, firstPosition);
        }
        int last = lastPositions[0];
        for (int lastPosition : lastPositions) {
            last = Math.max(last, lastPosition);
        }
        for (int i = first; i <= last; i++) {
            positions.add(i);
        }
        int[] firstCompletelyVisibleItemPositions = staggeredGridLayoutManager.findFirstCompletelyVisibleItemPositions(null);
        int[] lastCompletelyVisibleItemPositions = staggeredGridLayoutManager.findLastCompletelyVisibleItemPositions(null);
        for (int i = 0; i < staggeredGridLayoutManager.getSpanCount(); i++) {
            int firstPosition = firstPositions[i];
            int firstCompletelyVisibleItemPosition = firstCompletelyVisibleItemPositions[i];
            if (firstCompletelyVisibleItemPosition != firstPosition) {
                positions.remove(firstPosition);
            }
            int lastPosition = lastPositions[i];
            int lastCompletelyVisibleItemPosition = lastCompletelyVisibleItemPositions[i];
            if (lastCompletelyVisibleItemPosition != lastPosition) {
                positions.remove(lastPosition);
            }
        }
        JSONArray jsonArray = new JSONArray();
        for (int position : positions) {
            jsonArray.put(position);
        }
        return jsonArray;
    }

    @DoricMethod
    public void reload() {
        this.flowAdapter.loadAnchor = -1;
        // If reload,should reset native cache.
        for (int index = 0; index < this.flowAdapter.itemValues.size(); index++) {
            removeSubModel(this.flowAdapter.itemValues.valueAt(index));
        }
        this.flowAdapter.itemValues.clear();
        mView.post(new Runnable() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void run() {
                flowAdapter.notifyDataSetChanged();
            }
        });
    }

    @Override
    public void reset() {
        super.reset();
        scrollable = true;
        loadMore = false;
        loadMoreViewId = null;
        onLoadMoreFuncId = null;
        onScrollFuncId = null;
        onScrollEndFuncId = null;
        flowAdapter.renderItemFuncId = null;
        itemCanDragFuncId = null;
        beforeDraggingFuncId = null;
        onDraggingFuncId = null;
        onDraggedFuncId = null;
    }

    private static class DoricItemTouchHelper extends ItemTouchHelper {

        /**
         * Creates an ItemTouchHelper that will work with the given Callback.
         * <p>
         * You can attach ItemTouchHelper to a RecyclerView via
         * {@link #attachToRecyclerView(RecyclerView)}. Upon attaching, it will add an item decoration,
         * an onItemTouchListener and a Child attach / detach listener to the RecyclerView.
         *
         * @param callback The Callback which controls the behavior of this touch helper.
         */
        public DoricItemTouchHelper(@NonNull Callback callback) {
            super(callback);
        }
    }

    private static class DoricItemTouchHelperCallback extends ItemTouchHelper.Callback {

        private OnItemTouchCallbackListener onItemTouchCallbackListener;

        private boolean isCanDrag = false;
        private boolean isCanSwipe = false;

        private int fromPos;
        private int toPos;

        public DoricItemTouchHelperCallback(OnItemTouchCallbackListener onItemTouchCallbackListener) {
            this.onItemTouchCallbackListener = onItemTouchCallbackListener;
        }

        public void setOnItemTouchCallbackListener(OnItemTouchCallbackListener onItemTouchCallbackListener) {
            this.onItemTouchCallbackListener = onItemTouchCallbackListener;
        }

        public void setDragEnable(boolean canDrag) {
            isCanDrag = canDrag;
        }

        public void setSwipeEnable(boolean canSwipe) {
            isCanSwipe = canSwipe;
        }

        @Override
        public boolean isLongPressDragEnabled() {
            return isCanDrag;
        }

        @Override

        public boolean isItemViewSwipeEnabled() {
            return isCanSwipe;
        }

        @Override
        public int getMovementFlags(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder) {
            int dragFlags = ItemTouchHelper.UP | ItemTouchHelper.DOWN |
                    ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT;
            int swipeFlags = ItemTouchHelper.START | ItemTouchHelper.END;

            if (onItemTouchCallbackListener != null) {
                if (onItemTouchCallbackListener.itemCanDrag(viewHolder.getAdapterPosition())) {
                    return makeMovementFlags(dragFlags, swipeFlags);
                } else {
                    return 0;
                }
            } else {
                return makeMovementFlags(dragFlags, swipeFlags);
            }

        }

        @Override
        public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {
            if (onItemTouchCallbackListener != null) {
                return onItemTouchCallbackListener.onMove(viewHolder.getAdapterPosition(), target.getAdapterPosition());
            }
            return false;
        }

        @Override
        public void onSelectedChanged(@Nullable RecyclerView.ViewHolder viewHolder, int actionState) {
            super.onSelectedChanged(viewHolder, actionState);
            if (viewHolder != null) {
                fromPos = viewHolder.getAdapterPosition();
            }

            if (actionState == ACTION_STATE_DRAG) {
                if (onItemTouchCallbackListener != null) {
                    onItemTouchCallbackListener.beforeMove(fromPos);
                }
            }
        }

        @Override
        public void clearView(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder) {
            super.clearView(recyclerView, viewHolder);
            toPos = viewHolder.getAdapterPosition();

            if (onItemTouchCallbackListener != null) {
                onItemTouchCallbackListener.onMoved(fromPos, toPos);
            }
        }

        @Override
        public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
            if (onItemTouchCallbackListener != null) {
                onItemTouchCallbackListener.onSwiped(viewHolder.getAdapterPosition());
            }
        }
    }

    private interface OnItemTouchCallbackListener {
        void onSwiped(int adapterPosition);

        Boolean itemCanDrag(int fromPos);

        void beforeMove(int fromPos);

        boolean onMove(int srcPosition, int targetPosition);

        void onMoved(int fromPos, int toPos);
    }

    private static class DoricLinearSmoothScroller extends LinearSmoothScroller {

        public DoricLinearSmoothScroller(Context context) {
            super(context);
        }

        @Override
        public int calculateDyToMakeVisible(View view, int snapPreference) {
            final RecyclerView.LayoutManager layoutManager = getLayoutManager();
            if (layoutManager == null) {
                return 0;
            }
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
                    view.getLayoutParams();
            final int top = layoutManager.getDecoratedTop(view) - params.topMargin;
            final int bottom = layoutManager.getDecoratedBottom(view) + params.bottomMargin;
            final int start = layoutManager.getPaddingTop();
            final int end = layoutManager.getHeight() - layoutManager.getPaddingBottom();
            return calculateDtToFit(top, bottom, start, end, snapPreference);
        }
    }
}
