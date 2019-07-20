package com.github.penfeizhou.doricdemo;

import com.github.penfeizhou.doric.DoricComponent;
import com.github.penfeizhou.doric.DoricLibrary;
import com.github.penfeizhou.doric.DoricRegistry;

/**
 * @Description: com.github.penfeizhou.doricdemo
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricComponent
public class DemoLibrary extends DoricLibrary {
    @Override
    public void load(DoricRegistry registry) {
        registry.registerNativePlugin(DemoPlugin.class);
    }
}
