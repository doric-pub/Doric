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

import android.view.View;
import android.view.ViewGroup;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pub.doric.DoricContext;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-13
 */
public abstract class SuperNode<V extends View> extends ViewNode<V> {
    private final Map<String, JSObject> subNodes = new HashMap<>();
    protected boolean mReusable = false;

    public SuperNode(DoricContext doricContext) {
        super(doricContext);
    }

    public abstract ViewNode<?> getSubNodeById(String id);

    protected ViewGroup.LayoutParams generateDefaultLayoutParams() {
        return new ViewGroup.LayoutParams(0, 0);
    }

    @Override
    protected void blend(V view, String name, JSValue prop) {
        if (name.equals("subviews")) {
            if (prop.isArray()) {
                JSArray subviews = prop.asArray();
                for (int i = 0; i < subviews.size(); i++) {
                    JSObject subNode = subviews.get(i).asObject();
                    mixinSubNode(subNode);
                    blendSubNode(subNode);
                }
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    private void mixinSubNode(JSObject subNode) {
        String id = subNode.getProperty("id").asString().value();
        JSObject targetNode = subNodes.get(id);
        if (targetNode == null) {
            subNodes.put(id, subNode);
        } else {
            mixin(subNode, targetNode);
        }
    }

    public JSObject getSubModel(String id) {
        return subNodes.get(id);
    }

    public void setSubModel(String id, JSObject model) {
        subNodes.put(id, model);
    }

    public void clearSubModel() {
        subNodes.clear();
    }

    public void removeSubModel(String id) {
        subNodes.remove(id);
    }

    protected abstract void blendSubNode(JSObject subProperties);

    protected void blendSubLayoutConfig(ViewNode<?> viewNode, JSObject jsObject) {
        viewNode.blendLayoutConfig(jsObject);
    }

    private void mixin(JSObject src, JSObject target) {
        JSObject srcProps = src.getProperty("props").asObject();
        JSObject targetProps = target.getProperty("props").asObject();
        for (String key : srcProps.propertySet()) {
            JSValue jsValue = srcProps.getProperty(key);
            if ("subviews".equals(key) && jsValue.isArray()) {
                continue;
            }
            targetProps.asObject().setProperty(key, jsValue);
        }
    }

    private boolean viewIdIsEqual(JSObject src, JSObject target) {
        String srcId = src.asObject().getProperty("id").asString().value();
        String targetId = target.asObject().getProperty("id").asString().value();
        return srcId.equals(targetId);
    }

    protected void recursiveMixin(JSObject src, JSObject target) {
        JSObject srcProps = src.getProperty("props").asObject();
        JSObject targetProps = target.getProperty("props").asObject();
        JSValue oriSubviews = targetProps.getProperty("subviews");

        for (String key : srcProps.propertySet()) {
            JSValue jsValue = srcProps.getProperty(key);
            if ("subviews".equals(key) && jsValue.isArray()) {
                JSValue[] subviews = jsValue.asArray().toArray();

                List<JSValue> finalTarget = new ArrayList<>();

                for (JSValue subview : subviews) {
                    boolean find = false;
                    if (oriSubviews.isArray()) {
                        for (JSValue targetSubview : oriSubviews.asArray().toArray()) {
                            if (viewIdIsEqual(subview.asObject(), targetSubview.asObject())) {
                                find = true;
                                recursiveMixin(subview.asObject(), targetSubview.asObject());
                                finalTarget.add(targetSubview);
                                break;
                            }
                        }
                    }

                    if (!find) {
                        finalTarget.add(subview);
                    }
                }

                JSArray jsArray = new JSArray(finalTarget.size());
                for (int i = 0; i < jsArray.size(); i++) {
                    jsArray.put(i, finalTarget.get(i));
                }
                targetProps.asObject().setProperty(key, jsArray);
                continue;
            }
            targetProps.asObject().setProperty(key, jsValue);
        }
    }

    public Set<String> getSubNodeViewIds() {
        Set<String> allKeys = subNodes.keySet();
        Iterator<String> iterator = allKeys.iterator();
        while (iterator.hasNext()) {
            String element = iterator.next();
            if (getSubNodeById(element) == null) {
                iterator.remove();
            }
        }

        return allKeys;
    }

    @Override
    public void reset() {
        super.reset();
        for (String viewId : subNodes.keySet()) {
            ViewNode<?> viewNode = getSubNodeById(viewId);
            if (viewNode != null) {
                viewNode.reset();
            }
        }
    }

    public void setReusable(boolean reusable) {
        this.mReusable = reusable;
    }
}
