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

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;

/**
 * @Description: pub.doric.demo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-19
 */
public class DoricActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.doric_activity);
        if (savedInstanceState == null) {
            String scheme = getIntent().getStringExtra("scheme");
            String alias = getIntent().getStringExtra("alias");
            DoricFragment doricFragment = DoricFragment.newInstance(scheme, alias);
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.container, doricFragment)
                    .commit();
        }
    }

    @Override
    public void onBackPressed() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host);
        if (!navController.popBackStack()) {
            finish();
        }
    }
}
