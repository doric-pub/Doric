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

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;


import org.json.JSONObject;

import pub.doric.async.AsyncResult;
import pub.doric.shader.ViewNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
public class ListAdapter extends RecyclerView.Adapter<ListAdapter.DoricViewHolder> {

    final ListNode listNode;
    String renderItemFuncId;
    final String renderBunchedItemsFuncId = "renderBunchedItems";
    int itemCount = 0;
    int batchCount = 15;
    SparseArray<JSValue> itemValues = new SparseArray<>();

    public ListAdapter(ListNode listNode) {
        this.listNode = listNode;
    }

    @NonNull
    @Override
    public DoricViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ListItemNode node = (ListItemNode) ViewNode.create(listNode.getDoricContext(), "ListItem");
        node.setSuperNode(listNode);
        return new DoricViewHolder(node, node.getDoricLayer());
    }

    @Override
    public void onBindViewHolder(@NonNull DoricViewHolder holder, int position) {
        JSValue jsValue = getItemModel(position);
        if (jsValue.isObject()) {
            JSObject jsObject = jsValue.asObject();
            holder.listItemNode.setId(jsObject.getProperty("id").asString().value());
            holder.listItemNode.blend(jsObject.getProperty("props").asObject(), holder.itemView.getLayoutParams());
        }
    }

    @Override
    public int getItemCount() {
        return itemCount;
    }

    @Override
    public int getItemViewType(int position) {
        JSValue value = getItemModel(position);
        if (value.isObject()) {
            if (value.asObject().getProperty("identifier").isString()) {
                return value.asObject().getProperty("identifier").asString().value().hashCode();
            }
        }
        return super.getItemViewType(position);
    }

    private JSValue getItemModel(int position) {
        JSValue itemModel = itemValues.get(position);
        if (itemModel == null || !itemModel.isObject()) {
            AsyncResult<JSDecoder> asyncResult = listNode.callJSResponse(
                    renderBunchedItemsFuncId,
                    position,
                    batchCount);
            try {
                JSDecoder jsDecoder = asyncResult.synchronous().get();
                JSValue result = jsDecoder.decode();
                if (result.isArray()) {
                    JSArray jsArray = result.asArray();
                    for (int i = 0; i < jsArray.size(); i++) {
                        itemValues.put(i + position, jsArray.get(i));
                    }
                    return itemValues.get(position);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return itemModel;
    }


    void blendSubNode(JSObject subProperties) {
        String subNodeId = subProperties.getProperty("id").asString().value();
        for (int i = 0; i < itemValues.size(); i++) {
            JSValue jsValue = itemValues.valueAt(i);
            if (jsValue.isObject()) {
                JSObject jsObject = jsValue.asObject();
                if (subNodeId.equals(jsObject.getProperty("id").asString().value())) {
                    mixin(subProperties, jsObject);
                    int position = itemValues.keyAt(i);
                    notifyItemChanged(position);
                    break;
                }
            }
        }
    }

    private void mixin(JSObject src, JSObject target) {
        JSValue srcProps = src.getProperty("props");
        JSValue targetProps = target.getProperty("props");
        if (srcProps.isObject()) {
            if (targetProps.isObject()) {
                for (String key : srcProps.asObject().propertySet()) {
                    JSValue jsValue = srcProps.asObject().getProperty(key);
                    if ("children".equals(key) && jsValue.isArray()) {
                        JSValue targetChildren = targetProps.asObject().getProperty("children");
                        if (targetChildren.isArray() && targetChildren.asArray().size() == jsValue.asArray().size()) {
                            for (int i = 0; i < jsValue.asArray().size(); i++) {
                                JSValue childSrc = jsValue.asArray().get(i);
                                JSValue childTarget = targetChildren.asArray().get(i);
                                if (childSrc.isObject()) {
                                    if (childTarget.isObject()) {
                                        mixin(childSrc.asObject(), childTarget.asObject());
                                    } else {
                                        targetChildren.asArray().put(i, childSrc);
                                    }
                                }
                            }
                        }
                        continue;
                    }
                    targetProps.asObject().setProperty(key, jsValue);
                }
            } else {
                target.setProperty("props", srcProps);
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
