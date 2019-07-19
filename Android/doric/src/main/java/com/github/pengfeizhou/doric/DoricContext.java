package com.github.pengfeizhou.doric;

import com.github.pengfeizhou.doric.bridge.DoricNativePlugin;
import com.github.pengfeizhou.doric.extension.DoricPluginInfo;
import com.github.pengfeizhou.doric.utils.DoricSettableFuture;
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

    DoricContext(String contextId) {
        this.mContextId = contextId;
    }

    public static DoricContext createContext(String script, String alias) {
        return DoricDriver.getInstance().createContext(script, alias);
    }

    public DoricSettableFuture<JSDecoder> callEntity(String methodName, Object... args) {
        return DoricDriver.getInstance().invokeContextMethod(mContextId, methodName, args);
    }


    public String getContextId() {
        return mContextId;
    }

    public void teardown() {
        DoricDriver.getInstance().destroyContext(mContextId);
        mPluginMap.clear();
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
