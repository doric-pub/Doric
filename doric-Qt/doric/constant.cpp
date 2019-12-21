#include "constant.h"

const QString Constant::INJECT_LOG = "nativeLog";
const QString Constant::INJECT_REQUIRE = "nativeRequire";
const QString Constant::INJECT_TIMER_SET = "nativeSetTimer";
const QString Constant::INJECT_TIMER_CLEAR = "nativeClearTimer";
const QString Constant::INJECT_BRIDGE = "nativeBridge";
const QString Constant::INJECT_EMPTY = "nativeEmpty";

const QString Constant::TEMPLATE_CONTEXT_CREATE = QString("Reflect.apply(") +
        QString("function(doric,context,Entry,require,exports){") + QString("\n") +
        QString("%s1") + QString("\n") +
        QString("},doric.jsObtainContext(\"%s2\"),[") +
        QString("undefined,") +
        QString("doric.jsObtainContext(\"%s3\"),") +
        QString("doric.jsObtainEntry(\"%s4\"),") +
        QString("doric.__require__") +
        QString(",{}") +
        QString("])");
const QString Constant::TEMPLATE_MODULE = QString("Reflect.apply(doric.jsRegisterModule,this,[") +
        QString("\"%s1\",") +
        QString("Reflect.apply(function(__module){") +
        QString("(function(module,exports,require){") + QString("\n") +
        QString("%s2") + QString("\n") +
        QString("})(__module,__module.exports,doric.__require__);") +
        QString("\nreturn __module.exports;") +
        QString("},this,[{exports:{}}])") +
        QString("])");
const QString Constant::TEMPLATE_CONTEXT_DESTROY = QString("doric.jsReleaseContext(\"%s\")");

const QString Constant::GLOBAL_DORIC = QString("doric");
const QString Constant::DORIC_CONTEXT_INVOKE = QString("jsCallEntityMethod");
const QString Constant::DORIC_TIMER_CALLBACK = QString("jsCallbackTimer");

const QString Constant::DORIC_ENTITY_INIT = QString("__init__");
const QString Constant::DORIC_ENTITY_SHOW = QString("__onShow__");
