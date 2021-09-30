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

import android.text.TextUtils;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSNull;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.async.AsyncResult;
import pub.doric.shader.ViewNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
class FlowAdapter extends RecyclerView.Adapter<FlowAdapter.DoricViewHolder> {

    private final FlowLayoutNode flowLayoutNode;
    String renderItemFuncId;
    int itemCount = 0;
    int batchCount = 15;
    SparseArray<String> itemValues = new SparseArray<>();
    private int loadAnchor = 0;

    FlowAdapter(FlowLayoutNode flowLayoutNode) {
        this.flowLayoutNode = flowLayoutNode;
    }

    @NonNull
    @Override
    public DoricViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        FlowLayoutItemNode node = (FlowLayoutItemNode) ViewNode.create(flowLayoutNode.getDoricContext(), "FlowLayoutItem");
        node.init(flowLayoutNode);
        return new DoricViewHolder(node, node.getNodeView());
    }

    @Override
    public void onBindViewHolder(@NonNull DoricViewHolder holder, int position) {
        JSValue jsValue = getItemModel(position);
        if (jsValue != null && jsValue.isObject()) {
            JSObject jsObject = jsValue.asObject();
            holder.flowLayoutItemNode.setId(jsObject.getProperty("id").asString().value());
            holder.flowLayoutItemNode.blend(jsObject.getProperty("props").asObject());
        }
        if (position >= this.itemCount && !TextUtils.isEmpty(this.flowLayoutNode.onLoadMoreFuncId)) {
            callLoadMore();
            StaggeredGridLayoutManager.LayoutParams layoutParams = new StaggeredGridLayoutManager.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    holder.itemView.getLayoutParams().height
            );
            layoutParams.setFullSpan(true);
            holder.itemView.setLayoutParams(layoutParams);
        }
    }

    @Override
    public int getItemCount() {
        return this.itemCount + (this.flowLayoutNode.loadMore ? 1 : 0);
    }

    @Override
    public int getItemViewType(int position) {
        if (position >= itemCount) {
            return Integer.MAX_VALUE;
        }
        JSValue value = getItemModel(position);
        if (value.isObject()) {
            if (value.asObject().getProperty("identifier").isString()) {
                return value.asObject().getProperty("identifier").asString().value().hashCode();
            }
        }
        return super.getItemViewType(position);
    }

    private JSValue getItemModel(final int position) {
        if (position >= this.itemCount) {
            return this.flowLayoutNode.getSubModel(this.flowLayoutNode.loadMoreViewId);
        }
        String id = itemValues.get(position);
        if (TextUtils.isEmpty(id)) {
            AsyncResult<JSDecoder> asyncResult = flowLayoutNode.pureCallJSResponse(
                    "renderBunchedItems",
                    position,
                    batchCount);
            try {
                JSDecoder jsDecoder = asyncResult.synchronous().get();
                JSValue result = jsDecoder.decode();
                if (result.isArray()) {
                    JSArray jsArray = result.asArray();
                    for (int i = 0; i < jsArray.size(); i++) {
                        JSObject itemModel = jsArray.get(i).asObject();
                        String itemId = itemModel.getProperty("id").asString().value();
                        itemValues.put(i + position, itemId);
                        flowLayoutNode.setSubModel(itemId, itemModel);
                    }
                    return flowLayoutNode.getSubModel(itemValues.get(position));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new JSNull();
        } else {
            JSObject childModel = flowLayoutNode.getSubModel(id);
            if (childModel == null) {
                return new JSNull();
            } else {
                return childModel;
            }
        }
    }


    void blendSubNode(JSObject subProperties) {
        for (int i = 0; i < itemValues.size(); i++) {
            if (subProperties.getProperty("id").asString().value().equals(itemValues.valueAt(i))) {
                notifyItemChanged(i);
            }
        }
    }


    private void callLoadMore() {
        if (loadAnchor != itemCount) {
            loadAnchor = itemCount;
            this.flowLayoutNode.callJSResponse(this.flowLayoutNode.onLoadMoreFuncId);
        }
    }

    static class DoricViewHolder extends RecyclerView.ViewHolder {
        FlowLayoutItemNode flowLayoutItemNode;

        DoricViewHolder(FlowLayoutItemNode node, @NonNull View itemView) {
            super(itemView);
            flowLayoutItemNode = node;
        }
    }
}
