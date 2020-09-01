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

import android.content.Intent;
import android.net.Uri;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.Doric;
import pub.doric.DoricActivity;
import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.navigator.IDoricNavigator;
import pub.doric.utils.ThreadMode;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
@DoricPlugin(name = "navigator")
public class NavigatorPlugin extends DoricJavaPlugin {
    public NavigatorPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void push(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavigator navigator = getDoricContext().getDoricNavigator();
        if (navigator != null) {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                String source = jsObject.getProperty("source").asString().value();
                String alias = source;
                String extra = "";
                JSValue config = jsObject.getProperty("config");
                boolean singlePage = false;
                if (config.isObject()) {
                    JSValue aliasJS = config.asObject().getProperty("alias");
                    if (aliasJS.isString()) {
                        alias = aliasJS.asString().value();
                    }
                    JSValue extraJS = config.asObject().getProperty("extra");
                    if (extraJS.isString()) {
                        extra = extraJS.asString().value();
                    }
                    JSValue singlePageJS = config.asObject().getProperty("singlePage");
                    if (singlePageJS.isBoolean()) {
                        singlePage = singlePageJS.asBoolean().value();
                    }
                }
                if (singlePage) {
                    navigator.push(jsObject.getProperty("source").asString().value(),
                            alias,
                            extra
                    );
                } else {
                    Intent intent = new Intent(getDoricContext().getContext(), DoricActivity.class);
                    intent.putExtra("source", source);
                    intent.putExtra("alias", alias);
                    intent.putExtra("extra", extra);
                    getDoricContext().getContext().startActivity(intent);
                }
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        } else {
            promise.reject(new JavaValue("Navigator not implemented"));
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void pop(DoricPromise promise) {
        IDoricNavigator navigator = getDoricContext().getDoricNavigator();
        if (navigator != null) {
            navigator.pop();
            promise.resolve();
        } else {
            promise.reject(new JavaValue("Navigator not implemented"));
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void openUrl(String url, DoricPromise promise) {
        try {
            Uri uri = Uri.parse(url);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(uri);
            getDoricContext().getContext().startActivity(intent);
            promise.resolve();
        } catch (Exception e) {
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }
}
