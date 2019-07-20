package com.github.penfeizhou.doric.engine;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public interface IDoricJSE {
    /**
     * 执行JS语句
     *
     * @param script 执行的JS语句
     * @param source 该JS语句对应的文件名，在输出错误的堆栈信息时有用
     * @return 返回JS语句的执行结果，以String形式返回
     * @throws JSRuntimeException 如果执行的脚本有异常，会抛出包含堆栈的JSRuntimeException
     */
    String loadJS(String script, String source) throws JSRuntimeException;

    /**
     * 执行JS语句
     *
     * @param script  执行的JS语句
     * @param source  该JS语句对应的文件名，在输出错误的堆栈信息时有用
     * @param hashKey 是否在返回对象序列化时将key hash化
     * @return 返回JS语句的执行结果，以二进制数据的形式返回
     * @throws JSRuntimeException 如果执行的脚本有异常，会抛出包含堆栈的JSRuntimeException
     */
    JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException;


    /**
     * 向JS注入全局方法，由java实现
     *
     * @param name         js的方法名
     * @param javaFunction java中对应的实现类
     */
    void injectGlobalJSFunction(String name, JavaFunction javaFunction);

    /**
     * 向JS注入全局变量
     *
     * @param name      js中的变量名
     * @param javaValue 注入的全局变量，按Value进行组装
     */
    void injectGlobalJSObject(String name, JavaValue javaValue);

    /**
     * 执行JS某个方法
     *
     * @param objectName   执行的方法所属的变量名，如果方法为全局方法，该参数传null
     * @param functionName 执行的方法名
     * @param javaValues   方法需要的参数列表，按数组传入
     * @param hashKey      是否在返回对象序列化时将key hash化
     * @throws JSRuntimeException 如果执行的方法有异常，会抛出包含堆栈的JSRuntimeException
     */
    JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException;

    void teardown();
}
