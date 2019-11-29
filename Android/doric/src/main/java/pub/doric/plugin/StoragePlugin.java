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

import android.content.Context;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-22
 */
@DoricPlugin(name = "storage")
public class StoragePlugin extends DoricJavaPlugin {
    private static final String PREF_NAME = "pref_doric";

    public StoragePlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void setItem(JSObject jsObject, final DoricPromise promise) {
        try {
            JSValue zone = jsObject.getProperty("zone");
            String key = jsObject.getProperty("key").asString().value();
            String value = jsObject.getProperty("value").asString().value();
            String prefName = zone.isString() ? PREF_NAME + "_" + zone.asString() : PREF_NAME;
            getDoricContext().getContext().getSharedPreferences(
                    prefName,
                    Context.MODE_PRIVATE).edit().putString(key, value).apply();
            promise.resolve();
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod
    public void getItem(JSObject jsObject, final DoricPromise promise) {
        try {
            JSValue zone = jsObject.getProperty("zone");
            String key = jsObject.getProperty("key").asString().value();
            String prefName = zone.isString() ? PREF_NAME + "_" + zone.asString() : PREF_NAME;
            String ret = getDoricContext().getContext().getSharedPreferences(
                    prefName,
                    Context.MODE_PRIVATE).getString(key, "");
            promise.resolve(new JavaValue(ret));
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod
    public void remove(JSObject jsObject, final DoricPromise promise) {
        try {
            JSValue zone = jsObject.getProperty("zone");
            String key = jsObject.getProperty("key").asString().value();
            String prefName = zone.isString() ? PREF_NAME + "_" + zone.asString() : PREF_NAME;
            getDoricContext().getContext().getSharedPreferences(
                    prefName,
                    Context.MODE_PRIVATE).edit().remove(key).apply();
            promise.resolve();
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod
    public void clear(JSObject jsObject, final DoricPromise promise) {
        try {
            JSValue zone = jsObject.getProperty("zone");
            if (zone.isString()) {
                String prefName = PREF_NAME + "_" + zone.asString();
                getDoricContext().getContext().getSharedPreferences(
                        prefName,
                        Context.MODE_PRIVATE).edit().clear().apply();
                promise.resolve();
            } else {
                promise.reject(new JavaValue("Zone is empty"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }
}
