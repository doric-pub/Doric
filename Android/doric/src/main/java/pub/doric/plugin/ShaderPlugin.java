package pub.doric.plugin;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.utils.DoricLog;
import pub.doric.utils.ThreadMode;
import pub.doric.shader.RootNode;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;

import java.util.concurrent.Callable;

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
            final JSObject jsObject = jsDecoder.decode().asObject();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() throws Exception {
                    RootNode rootNode = getDoricContext().getRootNode();
                    rootNode.render(jsObject.getProperty("props").asObject());
                    return null;
                }
            }, ThreadMode.UI);
        } catch (Exception e) {
            e.printStackTrace();
            DoricLog.e("Shader.render:error%s", e.getLocalizedMessage());
        }

    }
}
