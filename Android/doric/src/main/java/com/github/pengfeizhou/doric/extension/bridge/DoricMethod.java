package com.github.pengfeizhou.doric.extension.bridge;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DoricMethod {
    String name() default "";

    Mode thread() default Mode.INDEPENDENT;

    enum Mode {
        UI,
        JS,
        INDEPENDENT,
    }
}
