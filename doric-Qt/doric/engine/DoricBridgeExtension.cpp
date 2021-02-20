#include <QDebug>
#include <QMetaObject>

#include "../DoricContextManager.h"
#include "DoricBridgeExtension.h"

DoricBridgeExtension::DoricBridgeExtension(QObject *parent) : QObject(parent) {}

void DoricBridgeExtension::callNative(QString contextId, QString module,
                                      QString methodName, QString callbackId,
                                      QJSValue jsValue) {
  DoricContext *context =
      DoricContextManager::getInstance()->getContext(contextId);
  bool classRegistered =
      context->getDriver()->getRegistry()->acquirePluginInfo(module);
  if (classRegistered) {
    QObject *plugin = context->obtainPlugin(module);
    QMetaObject::invokeMethod(plugin, methodName.toStdString().c_str(),
                              Qt::DirectConnection, QGenericReturnArgument(),
                              Q_ARG(QJSValue, jsValue),
                              Q_ARG(QString, callbackId));
  }
  qDebug() << "contextId: " + contextId << "module: " + module
           << "methodName: " + methodName << "callbackId: " + callbackId
           << "jsValue: " + jsValue.toString();
}
