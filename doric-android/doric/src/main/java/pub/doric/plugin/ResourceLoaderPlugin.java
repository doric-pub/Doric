/*
 * Copyright [2021] [Doric.Pub]
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

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import java.util.HashMap;
import java.util.Map;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.resource.DoricResource;
import pub.doric.utils.DoricLog;

/**
 * @Description: This is for loading resource into js as ArrayBuffer
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/18
 */
@DoricPlugin(name = "resourceLoader")
public class ResourceLoaderPlugin extends DoricJavaPlugin {
    private Map<String, DoricResource> cachedResources = new HashMap<>();

    public ResourceLoaderPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void load(final JSObject resource, final DoricPromise promise) {
        DoricResource doricResource = getDoricContext().getDriver().getRegistry().getResourceManager().load(
                getDoricContext(), resource);
        if (doricResource != null) {
            doricResource.fetch().setCallback(new AsyncResult.Callback<byte[]>() {
                @Override
                public void onResult(byte[] rawData) {
                    promise.resolve(new JavaValue(rawData));
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    DoricLog.e("Cannot load resource %s, %s", resource.toString(), t.getLocalizedMessage());
                    promise.reject(new JavaValue("Load error"));
                }

                @Override
                public void onFinish() {

                }
            });
        } else {
            DoricLog.e("Cannot find loader for resource %s", resource);
            promise.reject(new JavaValue("Load error"));
        }
    }
}
