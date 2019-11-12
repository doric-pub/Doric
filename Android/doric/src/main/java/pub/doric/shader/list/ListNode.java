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

import android.view.ViewGroup;

import androidx.recyclerview.widget.RecyclerView;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.ViewNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
@DoricPlugin(name = "List")
public class ListNode extends ViewNode<RecyclerView> {
    private final ListAdapter listAdapter;

    public ListNode(DoricContext doricContext) {
        super(doricContext);
        this.listAdapter = new ListAdapter(this);
    }

    @Override
    protected RecyclerView build(JSObject jsObject) {
        return new RecyclerView(getContext());
    }

    @Override
    protected void blend(RecyclerView view, ViewGroup.LayoutParams layoutParams, String name, JSValue prop) {
        switch (name) {
            case "itemCount":
                this.listAdapter.itemCount = prop.asNumber().toInt();
                break;
            case "renderItem":
                this.listAdapter.renderItemFuncId = prop.asString().value();
                break;
            case "renderBunchedItemsFuncId":
                this.listAdapter.renderBunchedItemsFuncId = prop.asString().value();
                break;
            case "batchCount":
                this.listAdapter.batchCount = 15;
                break;
            default:
                super.blend(view, layoutParams, name, prop);
                break;
        }
    }
}
