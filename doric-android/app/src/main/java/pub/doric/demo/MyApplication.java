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
package pub.doric.demo;

import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import java.util.HashMap;
import java.util.Map;

import pub.doric.Doric;
import pub.doric.DoricNativeDriver;
import pub.doric.DoricRegistry;
import pub.doric.DoricSingleton;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Doric.init(this);
        DoricRegistry.register(new DemoLibrary());
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_LOCALE_CHANGED);
        registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Map<String, Object> map = new HashMap<>();
                map.put("localeLanguage", context.getResources().getConfiguration().locale.getLanguage());
                map.put("localeCountry", context.getResources().getConfiguration().locale.getCountry());
                DoricSingleton.getInstance().setEnvironmentValue(map);
            }
        }, intentFilter);
        DoricNativeDriver.getInstance();
        Doric.enablePerformance(true);
        Doric.enableRenderSnapshot(true);
    }
}
