#include "native_jse.h"
#include <QDebug>

NativeJSE::NativeJSE()
{
    mJSEngine.installExtensions(QJSEngine::AllExtensions);
}

QString NativeJSE::loadJS(QString script, QString source)
{
    return mJSEngine.evaluate(script, source).toString();
}

void NativeJSE::injectGlobalJSObject(QString name, QObject *object)
{
    QJSValue jsObject = mJSEngine.newQObject(object);

    QList<QByteArray> propertyNames = object->dynamicPropertyNames();
    foreach(QByteArray propertyName, propertyNames)
    {
        QString key = QString::fromStdString(propertyName.toStdString());
        if (key == "undefined") {

        } else {
            jsObject.setProperty(key, mJSEngine.toScriptValue(object->property(propertyName)));
        }
    }

    mJSEngine.globalObject().setProperty(name, jsObject);
}

void NativeJSE::injectGlobalJSFunction(QString name, QObject *function, QString property)
{
    QJSValue functionObject = mJSEngine.newQObject(function);
    mJSEngine.globalObject().setProperty(name, functionObject.property(property));
}

QJSValue NativeJSE::invokeObject(QString objectName, QString functionName, QJSValueList arguments)
{
    QJSValue object = mJSEngine.evaluate(objectName);
    QJSValue function = object.property(functionName);
    return function.call(arguments);
}
