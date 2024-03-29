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
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;

import pub.doric.DoricActivity;
import pub.doric.devkit.DoricDev;
import pub.doric.navbar.BaseDoricNavBar;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/14
 */
public class DoricDebugActivity extends DoricActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
    }
}
