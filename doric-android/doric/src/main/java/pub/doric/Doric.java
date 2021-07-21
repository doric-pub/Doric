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
package pub.doric;

import android.app.Application;

import com.facebook.soloader.SoLoader;

import java.io.IOException;
import java.util.Map;

import pub.doric.loader.IDoricJSLoader;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class Doric {
    private static Application sApplication;

    /**
     * Init Function,must be called before doric run
     *
     * @param application Application instance
     */
    public static void init(Application application) {
        sApplication = application;
        try {
            SoLoader.init(application, 0);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Application application() {
        return sApplication;
    }

    /**
     * Register DoricLibrary For Extended ViewNode and Native Plugins
     *
     * @param doricLibrary Which registered in global
     */
    public static void registerLibrary(DoricLibrary doricLibrary) {
        DoricSingleton.getInstance().registerLibrary(doricLibrary);
    }

    /**
     * Add DoricJSLoader For Loading JS bundles
     *
     * @param jsLoader Which added in global
     */
    public static void addJSLoader(IDoricJSLoader jsLoader) {
        DoricSingleton.getInstance().getJsLoaderManager().addJSLoader(jsLoader);
    }

    public void setEnvironmentValue(Map<String, Object> value) {
        DoricSingleton.getInstance().setEnvironmentValue(value);
    }

    public static void enablePerformance(boolean enable) {
        DoricSingleton.getInstance().enablePerformance = enable;
    }

    public static boolean isEnablePerformance() {
        return DoricSingleton.getInstance().enablePerformance;
    }

    public static void enableRenderSnapshot(boolean enable) {
        DoricSingleton.getInstance().enableRenderSnapshot = enable;
    }

    public static boolean isEnableRenderSnapshot() {
        return DoricSingleton.getInstance().enableRenderSnapshot;
    }

}
