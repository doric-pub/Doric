package com.github.penfeizhou.doricdemo;

import android.widget.Toast;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricMethod;
import com.github.penfeizhou.doric.extension.bridge.DoricPlugin;
import com.github.penfeizhou.doric.plugin.DoricJavaPlugin;
import com.github.penfeizhou.doric.utils.ThreadMode;

/**
 * @Description: com.github.penfeizhou.doricdemo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
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
    public void testPromise() {
        Toast.makeText(getDoricContext().getContext(), "test", Toast.LENGTH_SHORT).show();
    }
}
