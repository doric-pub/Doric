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
package pub.doric.devkit.ui;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.KeyEvent;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.doric.DoricActivity;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.DoricContextDebuggable;
import pub.doric.devkit.event.EnterDebugEvent;
import pub.doric.devkit.event.ReloadEvent;
import pub.doric.devkit.event.StartDebugEvent;
import pub.doric.devkit.event.StopDebugEvent;
import pub.doric.devkit.util.SensorManagerHelper;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-19
 */
public class DemoDebugActivity extends DoricActivity {
    private SensorManagerHelper sensorHelper;
    private DoricContextDebuggable doricContextDebuggable;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sensorHelper = new SensorManagerHelper(this);
        sensorHelper.setOnShakeListener(new SensorManagerHelper.OnShakeListener() {
            @Override
            public void onShake() {
                Fragment devPanel = getSupportFragmentManager().findFragmentByTag("DevPanel");
                if (devPanel != null && devPanel.isAdded()) {
                    return;
                }
                new DevPanel().show(getSupportFragmentManager(), "DevPanel");
            }
        });
    }

    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        EventBus.getDefault().unregister(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        sensorHelper.stop();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onStartDebugEvent(StartDebugEvent startDebugEvent) {
        doricContextDebuggable = new DoricContextDebuggable(startDebugEvent.getContextId());
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEnterDebugEvent(EnterDebugEvent enterDebugEvent) {
        doricContextDebuggable.startDebug();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQuitDebugEvent(StopDebugEvent quitDebugEvent) {
        doricContextDebuggable.stopDebug();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onReloadEvent(ReloadEvent reloadEvent) {
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            if (reloadEvent.source.contains(context.getSource())) {
                if (doricContextDebuggable != null &&
                        doricContextDebuggable.isDebugging &&
                        doricContextDebuggable.getContext().getContextId().equals(context.getContextId())) {
                    System.out.println("is debugging context id: " + context.getContextId());
                } else {
                    context.reload(reloadEvent.script);
                }
            }
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (KeyEvent.KEYCODE_MENU == event.getKeyCode()) {
            new DevPanel().show(getSupportFragmentManager(), "DevPanel");
        }
        return super.onKeyDown(keyCode, event);
    }
}
