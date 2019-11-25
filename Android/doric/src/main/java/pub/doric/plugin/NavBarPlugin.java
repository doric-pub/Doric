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

import android.view.View;
import android.view.ViewGroup;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.navbar.IDoricNavBar;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-25
 */
@DoricPlugin(name = "navbar")
public class NavBarPlugin extends DoricJavaPlugin {
    public NavBarPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void isHidden(DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            promise.resolve(new JavaValue(navBar.isHidden()));
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setHidden(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                boolean hidden = jsObject.getProperty("hidden").asBoolean().value();
                navBar.setHidden(hidden);
                View v = getDoricContext().getRootNode().getDoricLayer();
                ViewGroup.LayoutParams params = v.getLayoutParams();
                if (params instanceof ViewGroup.MarginLayoutParams) {
                    ((ViewGroup.MarginLayoutParams) params).topMargin =
                            hidden ? 0
                                    : ((View) navBar).getMeasuredHeight();
                }
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setTitle(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                String title = jsObject.getProperty("title").asString().value();
                navBar.setTitle(title);
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void setBgColor(JSDecoder jsDecoder, DoricPromise promise) {
        IDoricNavBar navBar = getDoricContext().getDoricNavBar();
        if (navBar == null) {
            promise.reject(new JavaValue("Not implement NavBar"));
        } else {
            try {
                JSObject jsObject = jsDecoder.decode().asObject();
                int color = jsObject.getProperty("color").asNumber().toInt();
                navBar.setBackgroundColor(color);
                promise.resolve();
            } catch (ArchiveException e) {
                e.printStackTrace();
                promise.reject(new JavaValue(e.getLocalizedMessage()));
            }
        }
    }
}
