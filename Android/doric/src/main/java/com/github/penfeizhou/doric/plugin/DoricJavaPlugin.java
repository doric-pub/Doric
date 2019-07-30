package com.github.penfeizhou.doric.plugin;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.utils.DoricContextHolder;

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
