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
package pub.doric;

import android.animation.AnimatorSet;
import android.content.Context;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;

import org.json.JSONObject;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import pub.doric.async.AsyncResult;
import pub.doric.navbar.IDoricNavBar;
import pub.doric.navigator.IDoricNavigator;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.shader.RootNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.DoricMetaInfo;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricContext {
    private final String mContextId;
    private final Map<String, DoricJavaPlugin> mPluginMap = new HashMap<>();
    private final Context mContext;
    private RootNode mRootNode = new RootNode(this);
    private final String source;
    private String script;
    private String extra;
    private JSONObject initParams;
    private IDoricDriver doricDriver;
    private final Map<String, ViewNode> mHeadNodes = new HashMap<>();

    public Collection<ViewNode> allHeadNodes() {
        return mHeadNodes.values();
    }

    public void addHeadNode(ViewNode viewNode) {
        mHeadNodes.put(viewNode.getId(), viewNode);
    }

    public void removeHeadNode(ViewNode viewNode) {
        mHeadNodes.remove(viewNode.getId());
    }

    public ViewNode targetViewNode(String id) {
        if (id.equals(mRootNode.getId())) {
            return mRootNode;
        }
        return mHeadNodes.get(id);
    }

    protected DoricContext(Context context, String contextId, String source, String extra) {
        this.mContext = context;
        this.mContextId = contextId;
        this.source = source;
        this.extra = extra;
    }

    public String getSource() {
        return source;
    }

    public String getScript() {
        return script;
    }

    public static DoricContext create(Context context, String script, String source, String extra) {
        DoricContext doricContext = DoricContextManager.getInstance().createContext(context, script, source, extra);
        doricContext.script = script;
        doricContext.extra = extra;
        return doricContext;
    }

    public void init(float width, float height) {
        this.initParams = new JSONBuilder()
                .put("width", width)
                .put("height", height)
                .toJSONObject();
        callEntity(DoricConstant.DORIC_ENTITY_INIT, this.initParams, extra);
        callEntity(DoricConstant.DORIC_ENTITY_CREATE);
    }

    public void reInit() {
        this.mRootNode.setId("");
        callEntity(DoricConstant.DORIC_ENTITY_INIT, this.initParams, extra);
        callEntity(DoricConstant.DORIC_ENTITY_CREATE);
    }

    public AsyncResult<JSDecoder> callEntity(String methodName, Object... args) {
        return getDriver().invokeContextEntityMethod(mContextId, methodName, args);
    }

    public IDoricDriver getDriver() {
        if (doricDriver == null) {
            doricDriver = DoricNativeDriver.getInstance();
        }
        return doricDriver;
    }

    public void setDriver(IDoricDriver doricDriver) {
        this.doricDriver = doricDriver;
    }

    public RootNode getRootNode() {
        return mRootNode;
    }

    public Context getContext() {
        return mContext;
    }

    public String getContextId() {
        return mContextId;
    }

    public void teardown() {
        callEntity(DoricConstant.DORIC_ENTITY_DESTROY);
        DoricContextManager.getInstance().destroyContext(this).setCallback(new AsyncResult.Callback<Boolean>() {
            @Override
            public void onResult(Boolean result) {

            }

            @Override
            public void onError(Throwable t) {

            }

            @Override
            public void onFinish() {
                mPluginMap.clear();
            }
        });
    }

    public DoricJavaPlugin obtainPlugin(DoricMetaInfo<DoricJavaPlugin> doricMetaInfo) {
        DoricJavaPlugin plugin = mPluginMap.get(doricMetaInfo.getName());
        if (plugin == null) {
            plugin = doricMetaInfo.createInstance(this);
            mPluginMap.put(doricMetaInfo.getName(), plugin);
        }
        return plugin;
    }

    public void reload(String script) {
        this.script = script;
        this.mRootNode.setId("");
        getDriver().createContext(mContextId, script, source);
        callEntity(DoricConstant.DORIC_ENTITY_INIT, this.initParams, extra);
        onShow();
    }

    public void onShow() {
        callEntity(DoricConstant.DORIC_ENTITY_SHOW);
    }

    public void onHidden() {
        callEntity(DoricConstant.DORIC_ENTITY_HIDDEN);
    }

    private IDoricNavigator doricNavigator;

    public void setDoricNavigator(IDoricNavigator doricNavigator) {
        this.doricNavigator = doricNavigator;
    }

    public IDoricNavigator getDoricNavigator() {
        return this.doricNavigator;
    }

    private IDoricNavBar doricNavBar;

    public void setDoricNavBar(IDoricNavBar navBar) {
        this.doricNavBar = navBar;
    }

    public IDoricNavBar getDoricNavBar() {
        return this.doricNavBar;
    }

    private AnimatorSet animatorSet;

    public void setAnimatorSet(AnimatorSet animatorSet) {
        this.animatorSet = animatorSet;
    }

    public AnimatorSet getAnimatorSet() {
        return this.animatorSet;
    }

}
