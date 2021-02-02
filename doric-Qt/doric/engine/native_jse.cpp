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

QJSValue NativeJSE::invokeObject(QString objectName, QString functionName, QVariantList arguments)
{
    QJSValue object = mJSEngine.evaluate(objectName);
    QJSValue function = object.property(functionName);

    QJSValueList args;
    foreach(QVariant variant, arguments) {
        if (variant.type() == QVariant::String) {
            args.push_back(QJSValue(variant.toString()));
        } else if (variant.type() == QVariant::Map) {
            QJSValue arg = mJSEngine.newObject();
            QMap<QString, QVariant> map = variant.toMap();
            foreach (QString key, map.keys()) {
                QVariant value = map.value(key);
                if (value.type() == QVariant::String) {
                    arg.setProperty(key, value.toString());
                } else if (value.type() == QVariant::Int) {
                    arg.setProperty(key, value.toInt());
                }
            }
            args.push_back(arg);
        }
    }

    QJSValue result = function.call(args);
    if (result.isError())
        qDebug()
                << "Uncaught exception at line"
                << result.property("lineNumber").toInt()
                << ":" << result.toString();
    return result;
}
