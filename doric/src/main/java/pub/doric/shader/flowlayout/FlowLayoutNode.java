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

import android.graphics.Rect;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.shader.flowlayout
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-28
 */
@DoricPlugin(name = "FlowLayout")
public class FlowLayoutNode extends SuperNode<RecyclerView> {
    private final FlowAdapter flowAdapter;
    private final StaggeredGridLayoutManager staggeredGridLayoutManager = new StaggeredGridLayoutManager(
            2,
            StaggeredGridLayoutManager.VERTICAL);
    private int columnSpace = 0;
    private int rowSpace = 0;
    private Rect padding = new Rect();
    private final RecyclerView.ItemDecoration spacingItemDecoration = new RecyclerView.ItemDecoration() {
        @Override
        public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
            outRect.set(columnSpace / 2, rowSpace / 2, columnSpace / 2, rowSpace / 2);
        }
    };

    public FlowLayoutNode(DoricContext doricContext) {
        super(doricContext);
        this.flowAdapter = new FlowAdapter(this);
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
            case "columnSpace":
                columnSpace = DoricUtils.dp2px(prop.asNumber().toFloat());
                break;
            case "rowSpace":
                rowSpace = DoricUtils.dp2px(prop.asNumber().toFloat());
                break;
            case "columnCount":
                staggeredGridLayoutManager.setSpanCount(prop.asNumber().toInt());
                break;
            case "itemCount":
                this.flowAdapter.itemCount = prop.asNumber().toInt();
                break;
            case "renderItem":
                this.flowAdapter.renderItemFuncId = prop.asString().value();
                // If reset renderItem,should reset native cache.
                this.flowAdapter.itemValues.clear();
                clearSubModel();
                break;
            case "batchCount":
                this.flowAdapter.batchCount = prop.asNumber().toInt();
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
        if (mView != null) {
            mView.post(new Runnable() {
                @Override
                public void run() {
                    flowAdapter.notifyDataSetChanged();
                }
            });
        }
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
            flowAdapter.blendSubNode(subProperties);
        }
    }

    @Override
    protected RecyclerView build() {
        RecyclerView recyclerView = new RecyclerView(getContext());
        recyclerView.setLayoutManager(staggeredGridLayoutManager);
        recyclerView.setAdapter(flowAdapter);
        recyclerView.addItemDecoration(spacingItemDecoration);
        return recyclerView;
    }
}
