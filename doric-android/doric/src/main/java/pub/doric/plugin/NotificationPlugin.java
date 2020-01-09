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

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONObject;

import java.util.HashMap;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2020-01-08
 */
@DoricPlugin(name = "notification")
public class NotificationPlugin extends DoricJavaPlugin {

    private HashMap<String, BroadcastReceiver> systemReceivers = new HashMap<>();
    private HashMap<String, BroadcastReceiver> localReceivers = new HashMap<>();

    public NotificationPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void publish(JSObject args, DoricPromise promise) {
        String name = args.getProperty("name").asString().value();
        JSValue bizValue = args.getProperty("biz");
        if (bizValue.isString()) {
            String biz = bizValue.asString().value();
            name = "__doric__" + biz + "#" + name;
        }
        String data = null;
        JSValue value = args.getProperty("data");
        if (value.isString()) {
            data = value.asString().value();
        }
        value = args.getProperty("androidSystem");
        boolean androidSystem = false;
        if (value.isBoolean()) {
            androidSystem = value.asBoolean().value();
        }
        Intent intent = new Intent(name);
        intent.putExtra("__doric_data__", data);
        if (androidSystem) {
            getDoricContext().getContext().sendBroadcast(intent);
        } else {
            LocalBroadcastManager.getInstance(getDoricContext().getContext()).sendBroadcast(intent);
        }
        promise.resolve();
    }


    @DoricMethod
    public void subscribe(JSObject args, DoricPromise promise) {
        String name = args.getProperty("name").asString().value();
        JSValue bizValue = args.getProperty("biz");
        if (bizValue.isString()) {
            String biz = bizValue.asString().value();
            name = "__doric__" + biz + "#" + name;
        }
        final String callbackId = args.getProperty("callback").asString().value();
        JSValue value = args.getProperty("androidSystem");
        boolean androidSystem = false;
        if (value.isBoolean()) {
            androidSystem = value.asBoolean().value();
        }
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String data = intent.getStringExtra("__doric_data__");
                DoricPromise callback = new DoricPromise(getDoricContext(), callbackId);

                if (!TextUtils.isEmpty(data)) {
                    try {
                        callback.resolve(new JavaValue(new JSONObject(data)));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    Bundle extras = intent.getExtras();
                    if (extras != null) {
                        JSONBuilder builder = new JSONBuilder();
                        for (String key : extras.keySet()) {
                            builder.put(key, extras.get(key));
                        }
                        callback.resolve(new JavaValue(builder.toJSONObject()));
                    } else {
                        callback.resolve();
                    }
                }
            }
        };
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(name);
        if (androidSystem) {
            getDoricContext().getContext().registerReceiver(receiver, intentFilter);
            systemReceivers.put(callbackId, receiver);
        } else {
            LocalBroadcastManager.getInstance(getDoricContext().getContext())
                    .registerReceiver(receiver, intentFilter);
            localReceivers.put(callbackId, receiver);
        }
        promise.resolve(new JavaValue(callbackId));
    }

    @DoricMethod
    public void unsubscribe(String subscribeId, DoricPromise promise) {
        BroadcastReceiver receiver = localReceivers.get(subscribeId);
        if (receiver != null) {
            LocalBroadcastManager.getInstance(getDoricContext().getContext())
                    .unregisterReceiver(receiver);
            promise.resolve();
        } else {
            receiver = systemReceivers.get(subscribeId);
            if (receiver != null) {
                getDoricContext().getContext().unregisterReceiver(receiver);
            }
            promise.resolve();
        }
    }

    @Override
    public void onTearDown() {
        super.onTearDown();
        for (BroadcastReceiver receiver : localReceivers.values()) {
            LocalBroadcastManager.getInstance(getDoricContext().getContext())
                    .unregisterReceiver(receiver);
        }
        for (BroadcastReceiver receiver : systemReceivers.values()) {
            getDoricContext().getContext().unregisterReceiver(receiver);
        }
    }
}
