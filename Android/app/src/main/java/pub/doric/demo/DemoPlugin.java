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

import android.widget.Toast;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.utils.ThreadMode;

import com.github.pengfeizhou.jscore.JavaValue;

@DoricPlugin(name = "demo")
public class DemoPlugin extends DoricJavaPlugin {
    public DemoPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void test() {
        Toast.makeText(getDoricContext().getContext(), "test", Toast.LENGTH_SHORT).show();
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void testPromise(boolean b, DoricPromise doricPromise) {
        if (b) {
            doricPromise.resolve(new JavaValue("resolved by me"));
        } else {
            doricPromise.reject(new JavaValue("rejected by me"));
        }
        Toast.makeText(getDoricContext().getContext(), "test", Toast.LENGTH_SHORT).show();
    }
}
