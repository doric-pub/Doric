#include "stdarg.h"

#include "native_driver.h"
#include "utility/utility.h"

NativeDriver::~NativeDriver() {
    qDebug() << "NativeDriver destructor";
}

void NativeDriver::createContext(int contextId, QString *script)  {
    jsEngine->prepareContext(contextId, script);
}

void NativeDriver::destroyContext(int contextId)  {
    jsEngine->destroyContext(contextId);
}

void NativeDriver::invokeContextEntityMethod(int contextId, QString *method, ...) {
    QJSValueList *arguments = new QJSValueList();
    arguments->append(QJSValue(QString::number(contextId)));
    arguments->append(QJSValue(*method));

    va_list vaList;
    va_start(vaList, method);
    auto argument = va_arg(vaList, QVariant*);
    while (argument != nullptr) {
        if (QString(typeid(QJsonObject).name()).contains(QString(argument->typeName()))) {
            QJsonObject *jsonObject = static_cast<QJsonObject*>(argument->data());
            QJsonValue *jsonValue = new QJsonValue(*jsonObject);
            QJSValue jsValue = Utility::convert(jsEngine->engine, *jsonValue);
            delete jsonValue;
            arguments->append(jsValue);
        }
        argument = va_arg(vaList, QVariant*);
    }
    va_end(vaList);

    QJSValue result = jsEngine->engine->globalObject()
            .property(Constant::GLOBAL_DORIC)
            .property(Constant::DORIC_CONTEXT_INVOKE)
            .call(*arguments);
    qDebug() << "invokeContextEntityMethod: " + result.toString();
    delete arguments;
}

void NativeDriver::invokeDoricMethod(QString *method, ...) {

}
