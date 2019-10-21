package pub.doric.plugin;

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
}
