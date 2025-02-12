#include "doric_constant.h"

const std::string DoricConstant::DORIC_BUNDLE_SANDBOX = "doric-sandbox.js";
const std::string DoricConstant::DORIC_BUNDLE_LIB = "doric-lib.js";
const std::string DoricConstant::DORIC_MODULE_LIB = "doric";

const std::string DoricConstant::INJECT_ENVIRONMENT = "Environment";
const std::string DoricConstant::INJECT_LOG = "nativeLog";
const std::string DoricConstant::INJECT_REQUIRE = "nativeRequire";
const std::string DoricConstant::INJECT_TIMER_SET = "nativeSetTimer";
const std::string DoricConstant::INJECT_TIMER_CLEAR = "nativeClearTimer";
const std::string DoricConstant::INJECT_BRIDGE = "nativeBridge";

const std::string DoricConstant::TEMPLATE_CONTEXT_CREATE =
    std::string("Reflect.apply(") + "function(doric,context,Entry,require,exports){" + "\n" + "%s1" + "\n" +
    "},undefined,[" + "undefined," + "doric.jsObtainContext(\"%s2\")," + "doric.jsObtainEntry(\"%s3\")," +
    "doric.__require__" + ",{}" + "])";
const std::string DoricConstant::TEMPLATE_MODULE =
    std::string("Reflect.apply(doric.jsRegisterModule,this,[") + "\"%s1\"," + "Reflect.apply(function(__module){" +
    "(function(module,exports,require){" + "\n" + "%s2" + "\n" + "})(__module,__module.exports,doric.__require__);" +
    "\nreturn __module.exports;" + "},this,[{exports:{}}])" + "])";
const std::string DoricConstant::TEMPLATE_CONTEXT_DESTROY = std::string("doric.jsReleaseContext(\"%s\")");

const std::string DoricConstant::GLOBAL_DORIC = "doric";
const std::string DoricConstant::DORIC_CONTEXT_INVOKE = "jsCallEntityMethod";
const std::string DoricConstant::DORIC_CONTEXT_INVOKE_PURE = "pureCallEntityMethod";
const std::string DoricConstant::DORIC_TIMER_CALLBACK = "jsCallbackTimer";
const std::string DoricConstant::DORIC_BRIDGE_RESOLVE = "jsCallResolve";
const std::string DoricConstant::DORIC_BRIDGE_REJECT = "jsCallReject";
const std::string DoricConstant::DORIC_HOOK_NATIVE_CALL = "jsHookAfterNativeCall";

const std::string DoricConstant::DORIC_ENTITY_RESPONSE = "__response__";
const std::string DoricConstant::DORIC_ENTITY_INIT = "__init__";
const std::string DoricConstant::DORIC_ENTITY_CREATE = "__onCreate__";
const std::string DoricConstant::DORIC_ENTITY_BUILD = "__build__";
const std::string DoricConstant::DORIC_ENTITY_DESTROY = "__onDestroy__";
