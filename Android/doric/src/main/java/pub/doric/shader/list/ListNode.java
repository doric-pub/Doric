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

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
@DoricPlugin(name = "List")
public class ListNode extends SuperNode<RecyclerView> {
    private final ListAdapter listAdapter;

    public ListNode(DoricContext doricContext) {
        super(doricContext);
        this.listAdapter = new ListAdapter(this);
    }

    @Override
    protected void blendSubNode(JSObject subProperties) {
        listAdapter.blendSubNode(subProperties);
    }

    @Override
    protected RecyclerView build() {
        RecyclerView recyclerView = new RecyclerView(getContext());
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(this.listAdapter);
        return recyclerView;
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        if (mView != null) {
            mView.post(new Runnable() {
                @Override
                public void run() {
                    listAdapter.notifyDataSetChanged();
                }
            });
        }
    }

    @Override
    protected void blend(RecyclerView view, String name, JSValue prop) {
        switch (name) {
            case "itemCount":
                this.listAdapter.itemCount = prop.asNumber().toInt();
                break;
            case "renderItem":
                this.listAdapter.renderItemFuncId = prop.asString().value();
                // If reset renderItem,should reset native cache.
                this.listAdapter.itemValues.clear();
                break;
            case "batchCount":
                this.listAdapter.batchCount = 15;
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @Override
    protected void blendSubLayoutConfig(ViewNode viewNode, JSObject jsObject) {
        super.blendSubLayoutConfig(viewNode, jsObject);
    }
}
