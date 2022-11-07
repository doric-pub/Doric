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

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;

import org.json.JSONObject;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import pub.doric.DoricContext;
import pub.doric.DoricPanel;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.remote.ValueBuilder;
import pub.doric.navbar.BaseDoricNavBar;
import pub.doric.shader.RootNode;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/14
 */
public class DoricSSRActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_debug_timing);
        BaseDoricNavBar doricNavBar = findViewById(R.id.doric_nav_bar);
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
        RootNode rootNode = new RootNode(DoricContext.MOCK_CONTEXT);
        rootNode.setRootView(doricPanel);
        String filePath = getIntent().getStringExtra("file");
        String json = DoricUtils.readAssetFile("src/"+filePath);
        try {
            long start = System.currentTimeMillis();
            JSONObject jsonObject = new JSONObject(json);
            ValueBuilder vb = new ValueBuilder(jsonObject);
            JSDecoder jsDecoder = new JSDecoder(vb.build());
            JSObject jsObject = jsDecoder.decode().asObject();
            Log.d("Timing", "Decode cost " + (System.currentTimeMillis() - start) + " ms");
            rootNode.blend(jsObject.getProperty("props").asObject());
            Log.d("Timing", "SSR cost " + (System.currentTimeMillis() - start) + " ms");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
