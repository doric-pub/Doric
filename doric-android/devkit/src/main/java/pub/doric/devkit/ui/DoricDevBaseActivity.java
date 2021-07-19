/*
 * Copyright [2021] [Doric.Pub]
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

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;

/**
 * @Description: pub.doric.devkit.ui
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/19
 */
public class DoricDevBaseActivity extends AppCompatActivity {
    public static final String DORIC_CONTEXT_ID_KEY = "DORIC_CONTEXT_ID";
    protected DoricContext doricContext;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String contextId = getIntent().getStringExtra(DORIC_CONTEXT_ID_KEY);
        doricContext = DoricContextManager.getContext(contextId);
    }
}
