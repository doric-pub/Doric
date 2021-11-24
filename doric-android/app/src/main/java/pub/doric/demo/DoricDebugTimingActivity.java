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
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import pub.doric.DoricContext;
import pub.doric.DoricPanel;
import pub.doric.DoricSingleton;
import pub.doric.async.AsyncResult;
import pub.doric.devkit.DoricDev;
import pub.doric.navbar.BaseDoricNavBar;
import pub.doric.navigator.IDoricNavigator;
import pub.doric.performance.DoricPerformanceProfile;
import pub.doric.utils.DoricLog;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/14
 */
public class DoricDebugTimingActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final long pefStart = System.currentTimeMillis();
        setContentView(R.layout.activity_debug_timing);
        final BaseDoricNavBar doricNavBar = findViewById(R.id.doric_nav_bar);
        TextView textView = new TextView(this);
        textView.setText("Devkit");
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DoricDev.getInstance().openDevMode();
            }
        });
        textView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));
        doricNavBar.setRight(textView);
        final DoricPanel doricPanel = findViewById(R.id.doric_panel);
        DoricSingleton.getInstance().getJSLoaderManager().loadJSBundle(getSource()).setCallback(new AsyncResult.Callback<String>() {
            @Override
            public void onResult(String result) {
                doricPanel.config(result, getAlias(), getExtra());
                DoricContext context = doricPanel.getDoricContext();
                context.setDoricNavigator(new IDoricNavigator() {
                    @Override
                    public void push(String source, String alias, String extra) {

                    }

                    @Override
                    public void pop() {

                    }
                });
                context.setDoricNavBar(doricNavBar);
                doricPanel.getDoricContext().getPerformanceProfile().addAnchorHook(new DoricPerformanceProfile.AnchorHook() {
                    @Override
                    public void onAnchor(String name, long prepare, long start, long end) {
                        if (name.equals(DoricPerformanceProfile.STEP_RENDER)) {
                            long cost = end - pefStart;
                            Log.d("Timing", "Cost " + cost + "ms");
                        }
                    }
                });
            }

            @Override
            public void onError(Throwable t) {
                DoricLog.e("Doric load JS error:" + t.getLocalizedMessage());
            }

            @Override
            public void onFinish() {

            }
        });

    }

    /**
     * @return Scheme for DoricFragment to load.
     */
    protected String getSource() {
        return getIntent().getStringExtra("source");
    }

    /**
     * @return Alias used for JS error message.
     */
    protected String getAlias() {
        return getIntent().getStringExtra("alias");
    }

    /**
     * @return Extra data used for JS Panel in JSON format.
     */
    protected String getExtra() {
        return getIntent().getStringExtra("extra");
    }

}
