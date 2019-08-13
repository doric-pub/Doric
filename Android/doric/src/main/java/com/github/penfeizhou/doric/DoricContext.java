package com.github.penfeizhou.doric;

import android.content.Context;
import android.view.ViewGroup;

import com.github.penfeizhou.doric.async.AsyncResult;
import com.github.penfeizhou.doric.plugin.DoricJavaPlugin;
import com.github.penfeizhou.doric.utils.DoricConstant;
import com.github.penfeizhou.doric.utils.DoricMetaInfo;
import com.github.penfeizhou.doric.shader.RootNode;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

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
    private JSONObject initParams;

    DoricContext(Context context, String contextId, String source) {
        this.mContext = context;
        this.mContextId = contextId;
        this.source = source;
    }

    public String getSource() {
        return source;
    }

    public String getScript() {
        return script;
    }

    public static DoricContext create(Context context, String script, String source) {
        DoricContext doricContext = DoricContextManager.getInstance().createContext(context, script, source);
        doricContext.script = script;
        doricContext.callEntity(DoricConstant.DORIC_ENTITY_CREATE);
        return doricContext;
    }

    public void init(int width, int height) {
        this.initParams = new JSONBuilder()
                .put("width", width)
                .put("height", height).toJSONObject();
        callEntity(DoricConstant.DORIC_ENTITY_INIT, this.initParams);
    }

    public AsyncResult<JSDecoder> callEntity(String methodName, Object... args) {
        return getDriver().invokeContextEntityMethod(mContextId, methodName, args);
    }

    public IDoricDriver getDriver() {
        return DoricDriver.getInstance();
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
        getDriver().createContext(mContextId, script, source);
        callEntity(DoricConstant.DORIC_ENTITY_INIT, this.initParams);
    }

    public void onShow() {
        callEntity(DoricConstant.DORIC_ENTITY_SHOW);
    }

    public void onHidden() {
        callEntity(DoricConstant.DORIC_ENTITY_HIDDEN);
    }
}
