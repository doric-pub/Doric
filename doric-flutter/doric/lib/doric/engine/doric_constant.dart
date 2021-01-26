class DoricConstant {
  static final String DORIC_BUNDLE_SANDBOX = "doric-sandbox.js";
  static final String DORIC_BUNDLE_LIB = "doric-lib.js";
  static final String DORIC_MODULE_LIB = "doric";

  static final String INJECT_LOG = "nativeLog";
  static final String INJECT_REQUIRE = "nativeRequire";
  static final String INJECT_TIMER_SET = "nativeSetTimer";
  static final String INJECT_TIMER_CLEAR = "nativeClearTimer";
  static final String INJECT_BRIDGE = "nativeBridge";
  static final String INJECT_EMPTY = "nativeEmpty";

  static final String INJECT_ENVIRONMENT = "Environment";

  static final String TEMPLATE_CONTEXT_DESTROY =
      "doric.jsReleaseContext(\"%s\")";

  static final String TEMPLATE_CONTEXT_CREATE = "Reflect.apply(" +
      "function(doric,context,Entry,require,exports){" +
      "\n" +
      "%s" +
      "\n" +
      "},undefined,[" +
      "undefined," +
      "doric.jsObtainContext(\"%s\")," +
      "doric.jsObtainEntry(\"%s\")," +
      "doric.__require__" +
      ",{}" +
      "])";

  static final String TEMPLATE_MODULE =
      "Reflect.apply(doric.jsRegisterModule,this,[" +
          "\"%s\"," +
          "Reflect.apply(function(__module){" +
          "(function(module,exports,require){" +
          "\n" +
          "%s" +
          "\n" +
          "})(__module,__module.exports,doric.__require__);" +
          "\nreturn __module.exports;" +
          "},this,[{exports:{}}])" +
          "])";

  static final String GLOBAL_DORIC = "doric";
  static final String DORIC_CONTEXT_RELEASE = "jsReleaseContext";
  static final String DORIC_CONTEXT_INVOKE = "jsCallEntityMethod";
  static final String DORIC_TIMER_CALLBACK = "jsCallbackTimer";
  static final String DORIC_BRIDGE_RESOLVE = "jsCallResolve";
  static final String DORIC_BRIDGE_REJECT = "jsCallReject";

  static final String DORIC_ENTITY_RESPONSE = "__response__";
  static final String DORIC_ENTITY_INIT = "__init__";
  static final String DORIC_ENTITY_CREATE = "__onCreate__";
  static final String DORIC_ENTITY_DESTROY = "__onDestroy__";
  static final String DORIC_ENTITY_SHOW = "__onShow__";
  static final String DORIC_ENTITY_HIDDEN = "__onHidden__";
  static final String DORIC_ENTITY_BUILD = "__build__";
}
