/*
 * Copyright [2022] [Doric.Pub]
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
package pub.doric.shader.horizontallist;

import static androidx.recyclerview.widget.ItemTouchHelper.ACTION_STATE_DRAG;

import android.annotation.SuppressLint;
import android.content.Context;
import android.text.TextUtils;
import android.util.SparseArray;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.LinearSmoothScroller;
import androidx.recyclerview.widget.RecyclerView;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSNumber;
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
 * @Description: pub.doric.shader.horizontallist
 * @Author: jingpeng.wang
 * @CreateDate: 2022-8-22
 */
@DoricPlugin(name = "HorizontalList")
public class HorizontalListNode extends SuperNode<RecyclerView> implements IDoricScrollable {
    private final HorizontalListAdapter horizontalListAdapter;
    private String renderItemFuncId;
    String onLoadMoreFuncId;
    int itemCount = 0;
    int batchCount = 15;
    SparseArray<String> itemValues = new SparseArray<>();
    private boolean loadMore = false;
    String loadMoreViewId;
    private final Set<DoricScrollChangeListener> listeners = new HashSet<>();
    private String onScrollFuncId;
    private String onScrollEndFuncId;
    private final DoricJSDispatcher jsDispatcher = new DoricJSDispatcher();

    public HorizontalListNode(DoricContext doricContext) {
        super(doricContext);
        this.horizontalListAdapter = new HorizontalListAdapter(this);
    }

    private boolean scrollable = true;

    private final DoricItemTouchHelperCallback doricItemTouchHelperCallback = new DoricItemTouchHelperCallback(
            new OnItemTouchCallbackListener() {
                @Override
                public void onSwiped(int adapterPosition) {

                }

                @Override
                public void beforeMove(int fromPos) {
                    if (!TextUtils.isEmpty(beforeDraggingFuncId)) {
                        callJSResponse(beforeDraggingFuncId, fromPos);
                    }
                }

                @Override
                public boolean onMove(int srcPosition, int targetPosition) {
                    String srcValue = itemValues.valueAt(srcPosition);
                    String targetValue = itemValues.valueAt(targetPosition);
                    itemValues.setValueAt(srcPosition, targetValue);
                    itemValues.setValueAt(targetPosition, srcValue);
                    horizontalListAdapter.notifyItemMoved(srcPosition, targetPosition);
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

    private String beforeDraggingFuncId;
    private String onDraggingFuncId;
    private String onDraggedFuncId;

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
            horizontalListAdapter.blendSubNode(subProperties);
        }
    }

    @Override
    protected RecyclerView build() {
        final RecyclerView recyclerView = new RecyclerView(getContext());
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false) {
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
        });
        recyclerView.setAdapter(this.horizontalListAdapter);
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
                            horizontalListAdapter.onItemLongClick(position, childView);
                        }
                    }
                });

        recyclerView.addOnItemTouchListener(new RecyclerView.SimpleOnItemTouchListener() {
            @Override
            public boolean onInterceptTouchEvent(@NonNull RecyclerView rv, @NonNull MotionEvent e) {
                return gestureDetector.onTouchEvent(e);
            }
        });

        DoricItemTouchHelper doricItemTouchHelper = new DoricItemTouchHelper(doricItemTouchHelperCallback);

        doricItemTouchHelper.attachToRecyclerView(recyclerView);

        return recyclerView;
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        int limit = jsObject.propertySet().contains("loadMoreView") ? 2 : 1;
        if (jsObject.propertySet().size() > limit || !jsObject.propertySet().contains("subviews")) {
            if (mView != null) {
                mView.post(new Runnable() {
                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void run() {
                        horizontalListAdapter.loadMore = loadMore;
                        horizontalListAdapter.itemCount = itemCount;
                        horizontalListAdapter.notifyDataSetChanged();
                    }
                });
            }
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
                    this.horizontalListAdapter.loadAnchor = -1;
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
            case "canDrag":
                if (!prop.isBoolean()) {
                    return;
                }
                boolean canDrag = prop.asBoolean().value();
                doricItemTouchHelperCallback.setDragEnable(canDrag);
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
            HorizontalListAdapter.DoricViewHolder viewHolder = (HorizontalListAdapter.DoricViewHolder) mView.getChildViewHolder(view);
            if (id.equals(viewHolder.horizontalListItemNode.getId())) {
                return viewHolder.horizontalListItemNode;
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

    @DoricMethod
    public JSONArray findVisibleItems() {
        LinearLayoutManager linearLayoutManager = (LinearLayoutManager) this.mView.getLayoutManager();
        assert linearLayoutManager != null;
        int startPos = linearLayoutManager.findFirstVisibleItemPosition();
        int endPos = linearLayoutManager.findLastVisibleItemPosition();
        JSONArray jsonArray = new JSONArray();
        for (int i = startPos; i <= endPos; i++) {
            jsonArray.put(i);
        }
        return jsonArray;
    }

    @DoricMethod
    public JSONArray findCompletelyVisibleItems() {
        LinearLayoutManager linearLayoutManager = (LinearLayoutManager) this.mView.getLayoutManager();
        assert linearLayoutManager != null;
        int startPos = linearLayoutManager.findFirstCompletelyVisibleItemPosition();
        int endPos = linearLayoutManager.findLastCompletelyVisibleItemPosition();
        JSONArray jsonArray = new JSONArray();
        for (int i = startPos; i <= endPos; i++) {
            jsonArray.put(i);
        }
        return jsonArray;
    }

    @DoricMethod
    public void reload() {
        this.horizontalListAdapter.loadAnchor = -1;
        // If reload,should reset native cache.
        for (int index = 0; index < this.itemValues.size(); index++) {
            removeSubModel(this.itemValues.valueAt(index));
        }
        this.itemValues.clear();
        mView.post(new Runnable() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void run() {
                horizontalListAdapter.notifyDataSetChanged();
            }
        });

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

    @Override
    public void reset() {
        super.reset();
        scrollable = true;
        loadMore = false;
        loadMoreViewId = null;
        onLoadMoreFuncId = null;
        onScrollFuncId = null;
        onScrollEndFuncId = null;
        renderItemFuncId = null;
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
            RecyclerView.LayoutManager layoutManager = recyclerView.getLayoutManager();
            if (layoutManager instanceof LinearLayoutManager) {
                LinearLayoutManager linearLayoutManager = (LinearLayoutManager) layoutManager;
                int orientation = linearLayoutManager.getOrientation();
                int dragFlag = 0;
                int swipeFlag = 0;
                if (orientation == LinearLayoutManager.HORIZONTAL) {
                    swipeFlag = ItemTouchHelper.UP | ItemTouchHelper.DOWN;
                    dragFlag = ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT;
                }
                return makeMovementFlags(dragFlag, swipeFlag);
            }
            return 0;
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

        void beforeMove(int fromPos);

        boolean onMove(int srcPosition, int targetPosition);

        void onMoved(int fromPos, int toPos);
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
