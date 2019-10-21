
package pub.doric.demo;

import pub.doric.DoricComponent;
import pub.doric.DoricLibrary;
import pub.doric.DoricRegistry;

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
