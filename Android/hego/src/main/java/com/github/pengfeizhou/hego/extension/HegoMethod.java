package com.github.pengfeizhou.hego.extension;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface HegoMethod {
    String name() default "";
}
