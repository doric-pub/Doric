package com.github.penfeizhou.doric.plugin;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricMethod;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.penfeizhou.doric.utils.DoricLog;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;

/**
 * @Description: com.github.penfeizhou.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-22
 */
@DoricPlugin(name = "shader")
public class ShaderPlugin extends DoricJavaPlugin {
    public ShaderPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void render(JSDecoder jsDecoder) {
        try {
            JSObject jsObject = jsDecoder.decode().asObject();
        } catch (Exception e) {
            e.printStackTrace();
            DoricLog.e("Shader.render:error%s", e.getLocalizedMessage());
        }

    }
}
