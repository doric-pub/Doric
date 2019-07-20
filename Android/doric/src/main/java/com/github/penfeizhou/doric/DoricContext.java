package com.github.penfeizhou.doric;

import android.content.Context;

import com.github.penfeizhou.doric.async.AsyncResult;
import com.github.penfeizhou.doric.plugin.DoricNativePlugin;
import com.github.penfeizhou.doric.extension.bridge.DoricPluginInfo;
import com.github.pengfeizhou.jscore.JSDecoder;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricContext {
    private final String mContextId;
    private final Map<String, DoricNativePlugin> mPluginMap = new HashMap<>();
    private final Context mContext;

    DoricContext(Context context, String contextId) {
        this.mContext = context;
        this.mContextId = contextId;
    }

    public static DoricContext create(Context context, String script, String alias) {
        return DoricContextManager.getInstance().createContext(context, script, alias);
    }

    public AsyncResult<JSDecoder> callEntity(String methodName, Object... args) {
        return getDriver().invokeContextEntityMethod(mContextId, methodName, args);
    }

    public IDoricDriver getDriver() {
        return DoricDriver.getInstance();
    }

    public Context getContext() {
        return mContext;
    }

    public String getContextId() {
        return mContextId;
    }

    public void teardown() {
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

    public DoricNativePlugin obtainPlugin(DoricPluginInfo doricPluginInfo) {
        DoricNativePlugin plugin = mPluginMap.get(doricPluginInfo.getName());
        if (plugin == null) {
            plugin = doricPluginInfo.createPlugin(this);
            mPluginMap.put(doricPluginInfo.getName(), plugin);
        }
        return plugin;
    }
}
