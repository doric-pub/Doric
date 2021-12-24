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

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.concurrent.Callable;

import pub.doric.async.AsyncResult;
import pub.doric.navbar.IDoricNavBar;
import pub.doric.navigator.IDoricNavigator;
import pub.doric.performance.DoricPerformanceProfile;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.shader.RootNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.DoricConstant;
import pub.doric.utils.DoricMetaInfo;
import pub.doric.utils.ThreadMode;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricContext {
    private final String mContextId;
    private final Map<String, DoricJavaPlugin> mPluginMap = new HashMap<>();
    private final Context mContext;
    private final RootNode mRootNode = new RootNode(this);
    private final String source;
    private String script;
    private String extra;
    private JSONObject initParams;
    private IDoricDriver doricDriver;
    private final Map<String, Map<String, ViewNode<?>>> mHeadNodes = new HashMap<>();
    private final DoricPerformanceProfile performanceProfile;
    private final Map<String, Animator> animators = new HashMap<>();

    public Collection<ViewNode<?>> allHeadNodes(String type) {
        Map<String, ViewNode<?>> headNode = mHeadNodes.get(type);
        if (headNode != null) {
            return headNode.values();
        } else {
            return new ArrayList<>();
        }
    }

    public void addHeadNode(String type, ViewNode<?> viewNode) {
        Map<String, ViewNode<?>> map = mHeadNodes.get(type);
        if (map != null) {
            map.put(viewNode.getId(), viewNode);
        } else {
            map = new HashMap<>();
            map.put(viewNode.getId(), viewNode);
            mHeadNodes.put(type, map);
        }
    }

    public void removeHeadNode(String type, ViewNode<?> viewNode) {
        Map<String, ViewNode<?>> map = mHeadNodes.get(type);
        if (map != null) {
            map.remove(viewNode.getId());
        }
    }

    public void clearHeadNodes(String type) {
        Map<String, ViewNode<?>> map = mHeadNodes.get(type);
        if (map != null) {
            map.clear();
        }
    }

    public ViewNode<?> targetViewNode(String id) {
        if (id.equals(mRootNode.getId())) {
            return mRootNode;
        }
        for (Map<String, ViewNode<?>> map : mHeadNodes.values()) {
            if (map.containsKey(id)) {
                return map.get(id);
            }
        }
        return null;
    }

    protected DoricContext(Context context, String contextId, String source, String extra) {
        this.mContext = context;
        this.mContextId = contextId;
        this.source = source;
        this.extra = extra;
        this.performanceProfile = new DoricPerformanceProfile(contextId);
        DoricPerformanceProfile.AnchorHook anchorHook = getDriver().getRegistry().getGlobalPerformanceAnchorHook();
        if (anchorHook != null) {
            this.performanceProfile.addAnchorHook(anchorHook);
        }
    }

    public DoricPerformanceProfile getPerformanceProfile() {
        return this.performanceProfile;
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
        doricContext.init(extra);
        doricContext.callEntity(DoricConstant.DORIC_ENTITY_CREATE);
        return doricContext;
    }

    public void init(String initData) {
        if (Doric.isEnableRenderSnapshot()) {
            callEntity("__enableSnapshot__");
        }
        this.extra = initData;
        if (!TextUtils.isEmpty(initData)) {
            callEntity(DoricConstant.DORIC_ENTITY_INIT, initData);
        }
    }

    public void build(float width, float height) {
        this.initParams = new JSONBuilder()
                .put("width", width)
                .put("height", height)
                .toJSONObject();
        callEntity(DoricConstant.DORIC_ENTITY_BUILD, this.initParams);
    }

    public AsyncResult<JSDecoder> callEntity(String methodName, Object... args) {
        return getDriver().invokeContextEntityMethod(mContextId, methodName, args);
    }

    public IDoricDriver getDriver() {
        if (doricDriver == null) {
            doricDriver = DoricSingleton.getInstance().getNativeDriver();
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
        Set<String> animatorIds = animators.keySet();
        for (String animatorId : animatorIds) {
            Animator animator = animators.remove(animatorId);
            if (animator != null) {
                animator.cancel();
            }
        }
        callEntity(DoricConstant.DORIC_ENTITY_DESTROY).setCallback(new AsyncResult.Callback<JSDecoder>() {
            @Override
            public void onResult(JSDecoder result) {
            }

            @Override
            public void onError(Throwable t) {
            }

            @Override
            public void onFinish() {
                getDriver().asyncCall(new Callable<Object>() {
                    @Override
                    public Object call() {
                        for (DoricJavaPlugin javaPlugin : mPluginMap.values()) {
                            javaPlugin.onTearDown();
                        }
                        mPluginMap.clear();
                        return null;
                    }
                }, ThreadMode.UI);
            }
        });
        DoricContextManager.getInstance().destroyContext(this);
    }

    public DoricJavaPlugin obtainPlugin(DoricMetaInfo<DoricJavaPlugin> doricMetaInfo) {
        DoricJavaPlugin plugin = mPluginMap.get(doricMetaInfo.getName());
        if (plugin == null) {
            plugin = doricMetaInfo.createInstance(this);
            if (plugin != null) {
                mPluginMap.put(doricMetaInfo.getName(), plugin);
            }
        }
        return plugin;
    }

    public void reload(String script) {
        getDriver().destroyContext(getContextId());
        for (DoricJavaPlugin javaPlugin : mPluginMap.values()) {
            javaPlugin.onTearDown();
        }
        mPluginMap.clear();
        this.script = script;
        this.mRootNode.setId("");
        this.mRootNode.clearSubModel();
        this.mRootNode.getView().removeAllViews();
        getDriver().createContext(mContextId, script, source);
        init(this.extra);
        callEntity(DoricConstant.DORIC_ENTITY_CREATE);
        callEntity(DoricConstant.DORIC_ENTITY_BUILD, this.initParams);
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

    public JSONObject getInitParams() {
        return initParams;
    }

    public String getExtra() {
        return extra;
    }

    /**
     * Use this to take effect of {@link #onActivityResult(int, int, Intent)}
     */
    public void startActivityForResult(Intent intent, int requestCode) {
        if (doricNavigator instanceof Fragment) {
            ((Fragment) doricNavigator).startActivityForResult(intent, requestCode);
        }
    }

    /**
     * To use this,
     * you should use {@link #startActivityForResult(Intent, int)}.
     */
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        for (DoricJavaPlugin javaPlugin : mPluginMap.values()) {
            if (javaPlugin != null) {
                javaPlugin.onActivityResult(requestCode, resultCode, data);
            }
        }
    }

    public void onEnvChanged() {
        callEntity(DoricConstant.DORIC_ENTITY_ENV_CHANGE);
    }

    /**
     * Use this to take effect of {@link #onRequestPermissionsResult(int, String[], int[])}
     */
    public void requestPermissions(@NonNull String[] permissions, int requestCode) {
        if (doricNavigator instanceof Fragment) {
            ((Fragment) doricNavigator).requestPermissions(permissions, requestCode);
        }
    }

    /**
     * To use this,
     * you should use {@link #requestPermissions(String[], int)}.
     */
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        for (DoricJavaPlugin javaPlugin : mPluginMap.values()) {
            if (javaPlugin != null) {
                javaPlugin.onRequestPermissionsResult(requestCode, permissions, grantResults);
            }
        }
    }

    public void putAnimator(String animatorId, Animator animator) {
        animators.put(animatorId, animator);
    }

    public Animator getAnimator(String animatorId) {
        return animators.get(animatorId);
    }

    public void removeAnimator(String animatorId) {
        animators.remove(animatorId);
    }
}
