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

import android.os.Bundle;
import android.view.KeyEvent;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricPanel;
import pub.doric.devkit.event.EnterDebugEvent;
import pub.doric.devkit.event.QuitDebugEvent;
import pub.doric.devkit.event.ReloadEvent;
import pub.doric.devkit.ui.DevPanel;
import pub.doric.devkit.util.SensorManagerHelper;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-19
 */
public class DemoActivity extends AppCompatActivity {
    private DoricContext doricContext;
    private SensorManagerHelper sensorHelper;
    private DoricContextDebuggable doricContextDebuggable;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String source = getIntent().getStringExtra("source");
        DoricPanel doricPanel = new DoricPanel(this);
        addContentView(doricPanel, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        doricPanel.config(DoricUtils.readAssetFile("demo/" + source), source);
        doricContext = doricPanel.getDoricContext();
        doricContextDebuggable = new DoricContextDebuggable(doricContext);
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
    protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
        sensorHelper.stop();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEnterDebugEvent(EnterDebugEvent enterDebugEvent) {
        doricContextDebuggable.startDebug();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onReloadEvent(ReloadEvent reloadEvent) {
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            if (reloadEvent.source.contains(context.getSource())) {
                context.reload(reloadEvent.script);
            }
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQuitDebugEvent(QuitDebugEvent quitDebugEvent) {
        doricContextDebuggable.stopDebug();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (KeyEvent.KEYCODE_MENU == event.getKeyCode()) {
            new DevPanel().show(getSupportFragmentManager(), "DevPanel");
        }
        return super.onKeyDown(keyCode, event);
    }
}
