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
package pub.doric.shader;

import android.view.ViewGroup;

import pub.doric.DoricContext;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.ArrayList;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class GroupNode<F extends ViewGroup> extends SuperNode<F> {
    private ArrayList<ViewNode> mChildNodes = new ArrayList<>();
    private ArrayList<String> mChildViewIds = new ArrayList<>();

    public GroupNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected void blend(F view, String name, JSValue prop) {
        if ("children".equals(name)) {
            JSArray ids = prop.asArray();
            mChildViewIds.clear();
            for (int i = 0; i < ids.size(); i++) {
                mChildViewIds.add(ids.get(i).asString().value());
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        configChildNode();
    }

    private void configChildNode() {
        for (int idx = 0; idx < mChildViewIds.size(); idx++) {
            String id = mChildViewIds.get(idx);
            JSObject model = getSubModel(id);
            String type = model.getProperty("type").asString().value();
            if (idx < mChildNodes.size()) {
                ViewNode oldNode = mChildNodes.get(idx);
                if (id.equals(oldNode.getId())) {
                    //The same,skip
                } else {
                    //Find in remaining nodes
                    int position = -1;
                    for (int start = idx + 1; start < mChildNodes.size(); start++) {
                        ViewNode node = mChildNodes.get(start);
                        if (id.equals(node.getId())) {
                            //Found
                            position = start;
                            break;
                        }
                    }
                    if (position >= 0) {
                        //Found swap idx,position
                        ViewNode reused = mChildNodes.remove(position);
                        ViewNode abandoned = mChildNodes.remove(idx);
                        mChildNodes.set(idx, reused);
                        mChildNodes.set(position, abandoned);
                        //View swap index
                        mView.removeView(reused.getDoricLayer());
                        mView.addView(reused.getDoricLayer(), idx);
                        mView.removeView(abandoned.getDoricLayer());
                        mView.addView(abandoned.getDoricLayer(), position);
                    } else {
                        //Not found,insert
                        ViewNode newNode = ViewNode.create(getDoricContext(), type);
                        newNode.setId(id);
                        newNode.init(this);
                        newNode.blend(model.getProperty("props").asObject());

                        mChildNodes.add(idx, newNode);
                        mView.addView(newNode.getDoricLayer(), idx, newNode.getLayoutParams());
                    }
                }
            } else {
                //Insert
                ViewNode newNode = ViewNode.create(getDoricContext(), type);
                newNode.setId(id);
                newNode.init(this);
                newNode.blend(model.getProperty("props").asObject());
                mChildNodes.add(newNode);
                mView.addView(newNode.getDoricLayer(), idx, newNode.getLayoutParams());
            }
        }
        int size = mChildNodes.size();
        for (int idx = mChildViewIds.size(); idx < size; idx++) {
            ViewNode viewNode = mChildNodes.remove(mChildViewIds.size());
            mView.removeView(viewNode.getDoricLayer());
        }
    }

    @Override
    protected void blendSubNode(JSObject subProp) {
        String subNodeId = subProp.getProperty("id").asString().value();
        for (ViewNode node : mChildNodes) {
            if (subNodeId.equals(node.getId())) {
                node.blend(subProp.getProperty("props").asObject());
                break;
            }
        }
    }
}
