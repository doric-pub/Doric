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

import android.text.TextUtils;
import android.util.SparseArray;
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
class SlideAdapter extends RecyclerView.Adapter<SlideAdapter.DoricViewHolder> {

    private final SliderNode sliderNode;
    int itemCount = 0;
    int batchCount = 3;
    SparseArray<String> itemValues = new SparseArray<>();
    String renderPageFuncId;
    SlideAdapter(SliderNode sliderNode) {
        this.sliderNode = sliderNode;
    }

    @NonNull
    @Override
    public DoricViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        SlideItemNode node = (SlideItemNode) ViewNode.create(sliderNode.getDoricContext(), "SlideItem");
        node.init(sliderNode);
        return new DoricViewHolder(node, node.getNodeView());
    }

    @Override
    public void onBindViewHolder(@NonNull DoricViewHolder holder, int position) {
        JSValue jsValue = getItemModel(position);
        if (jsValue.isObject()) {
            JSObject jsObject = jsValue.asObject();
            holder.slideItemNode.setId(jsObject.getProperty("id").asString().value());
            holder.slideItemNode.blend(jsObject.getProperty("props").asObject());
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

    private JSValue getItemModel(final int position) {
        String id = itemValues.get(position);
        if (TextUtils.isEmpty(id)) {
            AsyncResult<JSDecoder> asyncResult = sliderNode.callJSResponse(
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
                        sliderNode.setSubModel(itemId, itemModel);
                    }
                    return sliderNode.getSubModel(itemValues.get(position));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new JSNull();
        } else {
            JSObject childModel = sliderNode.getSubModel(id);
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

    static class DoricViewHolder extends RecyclerView.ViewHolder {
        SlideItemNode slideItemNode;

        DoricViewHolder(SlideItemNode node, @NonNull View itemView) {
            super(itemView);
            slideItemNode = node;
        }
    }
}
