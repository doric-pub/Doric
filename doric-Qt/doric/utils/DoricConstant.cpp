#include "DoricConstant.h"

const QString DoricConstant::DORIC_BUNDLE_SANDBOX = "doric-sandbox.js";
const QString DoricConstant::DORIC_BUNDLE_LIB = "doric-lib.js";
const QString DoricConstant::DORIC_MODULE_LIB = "doric";

const QString DoricConstant::INJECT_ENVIRONMENT = "Environment";
const QString DoricConstant::INJECT_LOG = "nativeLog";
const QString DoricConstant::INJECT_EMPTY = "nativeEmpty";
const QString DoricConstant::INJECT_REQUIRE = "nativeRequire";
const QString DoricConstant::INJECT_TIMER_SET = "nativeSetTimer";
const QString DoricConstant::INJECT_TIMER_CLEAR = "nativeClearTimer";
const QString DoricConstant::INJECT_BRIDGE = "nativeBridge";

const QString DoricConstant::TEMPLATE_CONTEXT_CREATE =
    QString("Reflect.apply(") +
    "function(doric,context,Entry,require,exports){" + "\n" + "%s1" + "\n" +
    "},undefined,[" + "undefined," + "doric.jsObtainContext(\"%s2\")," +
    "doric.jsObtainEntry(\"%s3\")," + "doric.__require__" + ",{}" + "])";
const QString DoricConstant::TEMPLATE_MODULE =
    QString("Reflect.apply(doric.jsRegisterModule,this,[") + "\"%s1\"," +
    "Reflect.apply(function(__module){" + "(function(module,exports,require){" +
    "\n" + "%s2" + "\n" + "})(__module,__module.exports,doric.__require__);" +
    "\nreturn __module.exports;" + "},this,[{exports:{}}])" + "])";
const QString DoricConstant::TEMPLATE_CONTEXT_DESTROY =
    QString("doric.jsReleaseContext(\"%s\")");

const QString DoricConstant::GLOBAL_DORIC = "doric";
const QString DoricConstant::DORIC_CONTEXT_INVOKE = "jsCallEntityMethod";
const QString DoricConstant::DORIC_TIMER_CALLBACK = "jsCallbackTimer";

const QString DoricConstant::DORIC_ENTITY_RESPONSE = "__response__";
const QString DoricConstant::DORIC_ENTITY_INIT = "__init__";
const QString DoricConstant::DORIC_ENTITY_CREATE = "__onCreate__";
const QString DoricConstant::DORIC_ENTITY_BUILD = "__build__";
const QString DoricConstant::DORIC_ENTITY_DESTROY = "__onDestroy__";
