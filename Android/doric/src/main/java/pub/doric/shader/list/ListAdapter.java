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

import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
public class ListAdapter extends RecyclerView.Adapter<ListAdapter.DoricViewHolder> {

    private final ListNode listNode;
    String renderItemFuncId;
    String renderBunchedItemsFuncId;
    int itemCount = 0;
    int batchCount = 15;
    private SparseArray<JSObject> itemObjects = new SparseArray<>();

    public ListAdapter(ListNode listNode) {
        this.listNode = listNode;
    }

    @NonNull
    @Override
    public DoricViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return null;
    }

    @Override
    public void onBindViewHolder(@NonNull DoricViewHolder holder, int position) {

    }

    @Override
    public int getItemCount() {
        return itemCount;
    }

    @Override
    public int getItemViewType(int position) {
        return super.getItemViewType(position);
    }


    private void jsCallRenderItem() {
        listNode.callJSResponse(renderItemFuncId);
    }


    public static class DoricViewHolder extends RecyclerView.ViewHolder {
        public DoricViewHolder(@NonNull View itemView) {
            super(itemView);
        }
    }
}
