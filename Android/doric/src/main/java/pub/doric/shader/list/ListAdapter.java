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

import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.async.AsyncResult;
import pub.doric.shader.ViewNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
public class ListAdapter extends RecyclerView.Adapter<ListAdapter.DoricViewHolder> {

    private final ListNode listNode;
    String renderItemFuncId;
    private final String renderBunchedItemsFuncId = "renderBunchedItems";
    int itemCount = 0;
    int batchCount = 15;
    private SparseArray<JSObject> itemObjects = new SparseArray<>();

    public ListAdapter(ListNode listNode) {
        this.listNode = listNode;
    }

    @NonNull
    @Override
    public DoricViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ListItemNode node = (ListItemNode) ViewNode.create(listNode.getDoricContext(), "ListItem");
        node.setParentNode(listNode);
        return new DoricViewHolder(node, node.getDoricLayer());
    }

    @Override
    public void onBindViewHolder(@NonNull DoricViewHolder holder, int position) {
        JSObject jsObject = getItemModel(position);
        holder.listItemNode.blend(jsObject.getProperty("props").asObject(), holder.itemView.getLayoutParams());
    }

    @Override
    public int getItemCount() {
        return itemCount;
    }

    @Override
    public int getItemViewType(int position) {
        JSValue value = getItemModel(position).getProperty("identifier");
        if (value.isString()) {
            return value.asString().hashCode();
        }
        return super.getItemViewType(position);
    }

    private JSObject getItemModel(int position) {
        JSObject itemModel = itemObjects.get(position);
        if (itemModel == null) {
            AsyncResult<JSDecoder> asyncResult = listNode.callJSResponse(
                    renderBunchedItemsFuncId,
                    position,
                    batchCount);
            try {
                JSDecoder jsDecoder = asyncResult.synchronous().get();
                JSValue result = jsDecoder.decode();
                if (result.isArray()) {
                    JSValue[] values = result.asArray().toArray();
                    for (int i = 0; i < values.length; i++) {
                        itemObjects.put(i + position, values[i].asObject());
                    }
                    return values[0].asObject();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return itemModel;
    }


    static class DoricViewHolder extends RecyclerView.ViewHolder {
        ListItemNode listItemNode;

        public DoricViewHolder(ListItemNode node, @NonNull View itemView) {
            super(itemView);
            listItemNode = node;
        }
    }
}
