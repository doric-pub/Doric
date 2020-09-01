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

import android.content.Intent;

import pub.doric.DoricContext;
import pub.doric.utils.DoricContextHolder;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public abstract class DoricJavaPlugin extends DoricContextHolder {
    public DoricJavaPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    public void onTearDown() {

    }

    /**
     * Called when use {@link DoricContext#startActivityForResult(Intent, int)}
     */
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

    }
}
