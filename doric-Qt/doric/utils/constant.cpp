#include "constant.h"

const QString Constant::DORIC_BUNDLE_SANDBOX = "doric-sandbox.js";
const QString Constant::DORIC_BUNDLE_LIB = "doric-lib.js";
const QString Constant::DORIC_MODULE_LIB = "doric";

const QString Constant::INJECT_ENVIRONMENT = "Environment";
const QString Constant::INJECT_LOG = "nativeLog";
const QString Constant::INJECT_EMPTY = "nativeEmpty";
const QString Constant::INJECT_REQUIRE = "nativeRequire";
const QString Constant::INJECT_TIMER_SET = "nativeSetTimer";
const QString Constant::INJECT_TIMER_CLEAR = "nativeClearTimer";
const QString Constant::INJECT_BRIDGE = "nativeBridge";

const QString Constant::TEMPLATE_CONTEXT_CREATE = QString("Reflect.apply(") +
        "function(doric,context,Entry,require,exports){" + "\n" +
        "%s1" + "\n" +
        "},undefined,[" +
        "undefined," +
        "doric.jsObtainContext(\"%s2\")," +
        "doric.jsObtainEntry(\"%s3\")," +
        "doric.__require__" +
        ",{}" +
        "])";
const QString Constant::TEMPLATE_MODULE = QString("Reflect.apply(doric.jsRegisterModule,this,[") +
        "\"%s1\"," +
        "Reflect.apply(function(__module){" +
        "(function(module,exports,require){" + "\n" +
        "%s2" + "\n" +
        "})(__module,__module.exports,doric.__require__);" +
        "\nreturn __module.exports;" +
        "},this,[{exports:{}}])" +
        "])";
const QString Constant::TEMPLATE_CONTEXT_DESTROY = QString("doric.jsReleaseContext(\"%s\")");

const QString Constant::GLOBAL_DORIC = "doric";
const QString Constant::DORIC_CONTEXT_INVOKE = "jsCallEntityMethod";
const QString Constant::DORIC_TIMER_CALLBACK = "jsCallbackTimer";

const QString Constant::DORIC_ENTITY_INIT = "__init__";
const QString Constant::DORIC_ENTITY_CREATE = "__onCreate__";
const QString Constant::DORIC_ENTITY_BUILD = "__build__";
