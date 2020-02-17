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
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;


import java.util.ArrayList;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.GroupNode;
import pub.doric.shader.ViewNode;

/**
 * @Description: pub.doric.shader.slider
 * @Author: pengfei.zhou
 * @CreateDate: 2019-12-07
 */
@DoricPlugin(name = "NestedSlider")
public class NestedSliderNode extends GroupNode<ViewPager> implements ViewPager.OnPageChangeListener {
    private ArrayList<View> slideItems = new ArrayList<>();
    private String onPageSlidedFuncId;

    public NestedSliderNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected ViewPager build() {
        ViewPager viewPager = new ViewPager(getContext());
        viewPager.setAdapter(new PagerAdapter() {
            @Override
            public int getCount() {
                return slideItems.size();
            }

            @Override
            public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
                return view == object;
            }

            @Override
            public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
                container.removeView(slideItems.get(position));
            }

            @NonNull
            @Override
            public Object instantiateItem(@NonNull ViewGroup container, int position) {
                container.addView(slideItems.get(position));
                return slideItems.get(position);
            }
        });
        viewPager.addOnPageChangeListener(this);
        return viewPager;
    }

    @Override
    protected void blend(ViewPager view, String name, JSValue prop) {
        switch (name) {
            case "onPageSlided":
                this.onPageSlidedFuncId = prop.asString().toString();
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @Override
    protected void configChildNode() {
        for (int idx = 0; idx < mChildViewIds.size(); idx++) {
            String id = mChildViewIds.get(idx);
            JSObject model = getSubModel(id);
            String type = model.getProperty("type").asString().value();
            if (idx < mChildNodes.size()) {
                ViewNode oldNode = mChildNodes.get(idx);
                if (id.equals(oldNode.getId())) {
                    //The same,skip
                } else {
                    if (mReusable) {
                        if (oldNode.getType().equals(type)) {
                            //Same type,can be reused
                            oldNode.setId(id);
                            oldNode.blend(model.getProperty("props").asObject());
                        } else {
                            //Replace this view
                            mChildNodes.remove(idx);
                            slideItems.remove(oldNode.getNodeView());
                            ViewNode newNode = ViewNode.create(getDoricContext(), type);
                            newNode.setId(id);
                            newNode.init(this);
                            newNode.blend(model.getProperty("props").asObject());
                            mChildNodes.add(idx, newNode);
                            slideItems.add(idx, newNode.getNodeView());
                        }
                    } else {
                        //Find in remain nodes
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
                            slideItems.remove(reused.getNodeView());
                            slideItems.add(idx, reused.getNodeView());
                            slideItems.remove(abandoned.getNodeView());
                            slideItems.add(position, abandoned.getNodeView());
                        } else {
                            //Not found,insert
                            ViewNode newNode = ViewNode.create(getDoricContext(), type);
                            newNode.setId(id);
                            newNode.init(this);
                            newNode.blend(model.getProperty("props").asObject());

                            mChildNodes.add(idx, newNode);
                            slideItems.add(idx, newNode.getNodeView());
                        }
                    }
                }
            } else {
                //Insert
                ViewNode newNode = ViewNode.create(getDoricContext(), type);
                newNode.setId(id);
                newNode.init(this);
                newNode.blend(model.getProperty("props").asObject());
                mChildNodes.add(newNode);
                slideItems.add(idx, newNode.getNodeView());
            }
        }
        int size = mChildNodes.size();
        for (int idx = mChildViewIds.size(); idx < size; idx++) {
            ViewNode viewNode = mChildNodes.remove(mChildViewIds.size());
            slideItems.remove(viewNode.getNodeView());
        }
        mView.getAdapter().notifyDataSetChanged();
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {
        if (!TextUtils.isEmpty(onPageSlidedFuncId)) {
            callJSResponse(onPageSlidedFuncId, position);
        }
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }

    @DoricMethod
    public void slidePage(JSObject params, DoricPromise promise) {
        int page = params.getProperty("page").asNumber().toInt();
        boolean smooth = params.getProperty("smooth").asBoolean().value();
        mView.setCurrentItem(page, smooth);
        if (!TextUtils.isEmpty(onPageSlidedFuncId)) {
            callJSResponse(onPageSlidedFuncId, page);
        }
        promise.resolve();
    }

    @DoricMethod
    public int getSlidedPage() {
        return mView.getCurrentItem();
    }
}
