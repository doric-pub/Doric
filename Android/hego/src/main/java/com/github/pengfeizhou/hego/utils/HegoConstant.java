package com.github.pengfeizhou.hego.utils;

/**
 * @Description: Hego
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoConstant {
    public static final String INJECT_LOG = "nativeLog";
    public static final String INJECT_REQUIRE = "nativeRequire";
    public static final String INJECT_BRIDGE = "nativeBridge";

    public static final String TEMPLATE_CONTEXT_CREATE = "Reflect.apply(" +
            "function(hego,context,require,exports){" + "\n" +
            "%s" + "\n" +
            "},hego.jsObtainContext(\"%s\"),[" +
            "undefined," +
            "hego.jsObtainContext(\"%s\")," +
            "hego.__require__" +
            ",{}" +
            "])";

    public static final String TEMPLATE_MODULE = "Reflect.apply(hego.jsRegisterModule,this,[" +
            "\"%s\"," +
            "Reflect.apply(function(__module){" +
            "(function(module,exports,require){" + "\n" +
            "%s" + "\n" +
            "})(__module,__module.exports,hego.__require__);" +
            "\nreturn __module.exports;" +
            "},this,[{exports:{}}])" +
            "])";
    public static final String TEMPLATE_CONTEXT_DESTORY = "hego.jsRelease(%s)";
    public static final String GLOBAL_HEGO = "hego";
    public static final String HEGO_CONTEXT_RELEASE = "jsReleaseContext";
    public static final String HEGO_CONTEXT_INVOKE = "jsCallEntityMethod";
}
