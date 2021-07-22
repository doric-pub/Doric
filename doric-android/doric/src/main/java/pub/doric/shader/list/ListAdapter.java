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

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

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
class ListAdapter extends RecyclerView.Adapter<ListAdapter.DoricViewHolder> {

    private final ListNode listNode;

    ListAdapter(ListNode listNode) {
        this.listNode = listNode;
    }

    private int itemCount = 0;
    private int loadAnchor = 0;

    @NonNull
    @Override
    public DoricViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ListItemNode node = (ListItemNode) ViewNode.create(listNode.getDoricContext(), "ListItem");
        node.init(listNode);
        return new DoricViewHolder(node, node.getNodeView());
    }

    @Override
    public void onBindViewHolder(@NonNull DoricViewHolder holder, int position) {
        JSValue jsValue = getItemModel(position);
        if (jsValue != null && jsValue.isObject()) {
            JSObject jsObject = jsValue.asObject();
            holder.listItemNode.setId(jsObject.getProperty("id").asString().value());
            holder.listItemNode.blend(jsObject.getProperty("props").asObject());
        }
        if (position >= this.listNode.itemCount && !TextUtils.isEmpty(this.listNode.onLoadMoreFuncId)) {
            callLoadMore();
        }
    }

    @Override
    public int getItemCount() {
        return this.itemCount;
    }

    @Override
    public int getItemViewType(int position) {
        if (position >= this.listNode.itemCount) {
            return Integer.MAX_VALUE;
        }
        JSValue value = getItemModel(position);
        if (value != null && value.isObject()) {
            if (value.asObject().getProperty("props").asObject().getProperty("identifier").isString()) {
                return value.asObject().getProperty("props").asObject().getProperty("identifier").asString().value().hashCode();
            }
        }
        return super.getItemViewType(position);
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    private JSValue getItemModel(int position) {
        if (position >= this.listNode.itemCount) {
            return this.listNode.getSubModel(this.listNode.loadMoreViewId);
        }
        String id = listNode.itemValues.get(position);
        if (TextUtils.isEmpty(id)) {
            int batchCount = listNode.batchCount;
            int start = position;
            while (start > 0 && TextUtils.isEmpty(listNode.itemValues.get(start - 1))) {
                start--;
                batchCount++;
            }
            AsyncResult<JSDecoder> asyncResult = listNode.pureCallJSResponse(
                    "renderBunchedItems",
                    start,
                    batchCount);
            try {
                JSDecoder jsDecoder = asyncResult.synchronous().get();
                JSValue result = jsDecoder.decode();
                if (result.isArray()) {
                    JSArray jsArray = result.asArray();
                    for (int i = 0; i < jsArray.size(); i++) {
                        JSObject itemModel = jsArray.get(i).asObject();
                        String itemId = itemModel.getProperty("id").asString().value();
                        listNode.itemValues.put(i + start, itemId);
                        listNode.setSubModel(itemId, itemModel);
                    }
                    return listNode.getSubModel(listNode.itemValues.get(position));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new JSNull();
        } else {
            JSObject childModel = listNode.getSubModel(id);
            if (childModel == null) {
                return new JSNull();
            } else {
                return childModel;
            }
        }
    }


    void blendSubNode(JSObject subProperties) {
        for (int i = 0; i < listNode.itemValues.size(); i++) {
            if (subProperties.getProperty("id").asString().value().equals(listNode.itemValues.valueAt(i))) {
                notifyItemChanged(i);
            }
        }
    }

    private void callLoadMore() {
        if (loadAnchor != itemCount) {
            loadAnchor = itemCount;
            this.listNode.callJSResponse(this.listNode.onLoadMoreFuncId);
        }
    }

    public void onItemLongClick(int position, View childView) {
        JSValue jsValue = getItemModel(position);
        if (jsValue != null && jsValue.isObject()) {
            JSObject jsObject = jsValue.asObject();
            String id = jsObject.getProperty("id").asString().value();
            final ViewNode<?> itemNode = this.listNode.getSubNodeById(id);
            JSObject props = jsObject.getProperty("props").asObject();
            JSValue prop = props.getProperty("actions");
            if (itemNode != null && prop.isArray()) {
                JSArray actions = prop.asArray();
                if (actions != null && actions.size() > 0) {
                    String[] items = new String[actions.size()];
                    final String[] callbacks = new String[actions.size()];
                    for (int i = 0; i < actions.size(); i++) {
                        JSObject action = actions.get(i).asObject();
                        String title = action.getProperty("title").asString().value();
                        String callback = action.getProperty("callback").asString().value();
                        items[i] = title;
                        callbacks[i] = callback;
                    }
                    new AlertDialog.Builder(childView.getContext())
                            .setItems(items, new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    itemNode.callJSResponse(callbacks[which]);
                                    dialog.dismiss();
                                }
                            }).show();
                }
            }
        }
    }

    static class DoricViewHolder extends RecyclerView.ViewHolder {
        ListItemNode listItemNode;

        DoricViewHolder(ListItemNode node, @NonNull View itemView) {
            super(itemView);
            listItemNode = node;
        }
    }
}
