package pub.doric.utils;

import pub.doric.DoricContext;

/**
 * @Description: com.github.penfeizhou.doric.utils
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public abstract class DoricContextHolder {
    private final DoricContext doricContext;

    public DoricContextHolder(DoricContext doricContext) {
        this.doricContext = doricContext;
    }

    public DoricContext getDoricContext() {
        return doricContext;
    }
}
