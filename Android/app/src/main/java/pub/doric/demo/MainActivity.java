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
import android.widget.FrameLayout;

import androidx.appcompat.app.AppCompatActivity;


import java.io.IOException;

import pub.doric.DoricContext;
import pub.doric.DoricDriver;
import pub.doric.dev.DevPanel;
import pub.doric.dev.LocalServer;
import pub.doric.dev.event.EnterDebugEvent;
import pub.doric.dev.event.QuitDebugEvent;
import pub.doric.engine.ChangeEngineCallback;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;


public class MainActivity extends AppCompatActivity {

    private DevPanel devPanel = new DevPanel();

    private DoricContext doricContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        doricContext = DoricContext.create(this, DoricUtils.readAssetFile("demo/Snake.js"), "test");
        doricContext.init(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
//        doricContext.callEntity("log");
        doricContext.getRootNode().setRootView((FrameLayout) findViewById(R.id.root));

        LocalServer localServer = new LocalServer(getApplicationContext(), 8910);
        try {
            localServer.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
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
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEnterDebugEvent(EnterDebugEvent enterDebugEvent) {
        DoricDriver.getInstance().changeJSEngine(false, new ChangeEngineCallback() {
            @Override
            public void changed() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        doricContext.init(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
                    }
                });
            }
        });
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQuitDebugEvent(QuitDebugEvent quitDebugEvent) {
        DoricDriver.getInstance().changeJSEngine(true, new ChangeEngineCallback() {
            @Override
            public void changed() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        doricContext.init(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
                    }
                });
            }
        });
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (KeyEvent.KEYCODE_MENU == event.getKeyCode()) {
            devPanel.show(getSupportFragmentManager(), "DevPanel");
        }
        return super.onKeyDown(keyCode, event);
    }
}
