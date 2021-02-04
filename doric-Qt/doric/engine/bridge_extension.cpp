#include <QDebug>
#include <QMetaObject>

#include "bridge_extension.h"
#include "../context_manager.h"

BridgeExtension::BridgeExtension(QObject *parent) : QObject(parent)
{

}

void BridgeExtension::callNative(QString contextId, QString module, QString methodName, QString callbackId, QJSValue jsValue)
{
    Context *context = ContextManager::getInstance()->getContext(contextId);
    bool classRegistered = context->getDriver()->getRegistry()->acquirePluginInfo(module);
    if (classRegistered) {
        QObject *plugin = context->obtainPlugin(module);
        QMetaObject::invokeMethod(
                    plugin,
                    methodName.toStdString().c_str(),
                    Qt::DirectConnection, QGenericReturnArgument(),
                    Q_ARG(QJSValue, jsValue), Q_ARG(QString, callbackId));
        qDebug() << plugin;
    }
    qDebug() << "contextId: " + contextId;
    qDebug() << "module: " + module;
    qDebug() << "methodName: " + methodName;
    qDebug() << "callbackId: " + callbackId;
    qDebug() << "jsValue: " + jsValue.toString();
}
