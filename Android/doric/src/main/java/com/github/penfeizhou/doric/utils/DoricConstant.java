package com.github.penfeizhou.doric.utils;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricConstant {
    public static final String DORIC_BUNDLE_SANDBOX = "bundle/doric-sandbox.js";
    public static final String DORIC_BUNDLE_LIB = "bundle/doric-lib.js";
    public static final String DORIC_MODULE_LIB = "doric";


    public static final String INJECT_LOG = "nativeLog";
    public static final String INJECT_REQUIRE = "nativeRequire";
    public static final String INJECT_TIMER_SET = "nativeSetTimer";
    public static final String INJECT_TIMER_CLEAR = "nativeClearTimer";
    public static final String INJECT_BRIDGE = "nativeBridge";

    public static final String TEMPLATE_CONTEXT_CREATE = "Reflect.apply(" +
            "function(doric,context,Entry,require,exports){" + "\n" +
            "%s" + "\n" +
            "},doric.jsObtainContext(\"%s\"),[" +
            "undefined," +
            "doric.jsObtainContext(\"%s\")," +
            "doric.jsObtainEntry(\"%s\")," +
            "doric.__require__" +
            ",{}" +
            "])";

    public static final String TEMPLATE_MODULE = "Reflect.apply(doric.jsRegisterModule,this,[" +
            "\"%s\"," +
            "Reflect.apply(function(__module){" +
            "(function(module,exports,require){" + "\n" +
            "%s" + "\n" +
            "})(__module,__module.exports,doric.__require__);" +
            "\nreturn __module.exports;" +
            "},this,[{exports:{}}])" +
            "])";
    public static final String TEMPLATE_CONTEXT_DESTROY = "doric.jsReleaseContext(\"%s\")";
    public static final String GLOBAL_DORIC = "doric";
    public static final String DORIC_CONTEXT_RELEASE = "jsReleaseContext";
    public static final String DORIC_CONTEXT_INVOKE = "jsCallEntityMethod";
    public static final String DORIC_TIMER_CALLBACK = "jsCallbackTimer";
    public static final String DORIC_BRIDGE_RESOLVE = "jsCallResolve";
    public static final String DORIC_BRIDGE_REJECT = "jsCallReject";


    public static final String DORIC_ENTITY_RESPONSE = "__response__";
    public static final String DORIC_ENTITY_INIT = "__init__";
    public static final String DORIC_ENTITY_CREATE = "__onCreate__";
    public static final String DORIC_ENTITY_DESTROY = "__onDestroy__";
    public static final String DORIC_ENTITY_SHOW = "__onShow__";
    public static final String DORIC_ENTITY_HIDDEN = "__onHidden__";
}
