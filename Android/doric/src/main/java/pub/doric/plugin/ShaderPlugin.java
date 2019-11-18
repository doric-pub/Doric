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
package pub.doric.plugin;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.DoricLog;
import pub.doric.utils.ThreadMode;
import pub.doric.shader.RootNode;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

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
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {

                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    DoricLog.e("Shader.render:error%s", t.getLocalizedMessage());
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            DoricLog.e("Shader.render:error%s", e.getLocalizedMessage());
        }
    }

    @DoricMethod
    public void command(JSDecoder jsDecoder, final DoricPromise doricPromise) {
        try {
            final JSObject jsObject = jsDecoder.decode().asObject();
            final JSValue[] viewIds = jsObject.getProperty("viewIds").asArray().toArray();
            final String name = jsObject.getProperty("name").asString().value();
            getDoricContext().getDriver().asyncCall(new Callable<JavaValue>() {
                @Override
                public JavaValue call() throws Exception {
                    return new JavaValue("called");
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<JavaValue>() {
                @Override
                public void onResult(JavaValue result) {
                    doricPromise.resolve(result);
                }

                @Override
                public void onError(Throwable t) {
                    doricPromise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (ArchiveException e) {
            e.printStackTrace();
        }
    }
}
