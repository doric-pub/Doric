package com.github.penfeizhou.doric.render;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Description: com.github.penfeizhou.doric.render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface DoricNode {
    String name();
}