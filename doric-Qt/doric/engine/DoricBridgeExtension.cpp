#include <QDebug>
#include <QJsonDocument>
#include <QJsonObject>
#include <QMetaObject>

#include "../DoricContextManager.h"
#include "DoricBridgeExtension.h"

DoricBridgeExtension::DoricBridgeExtension(QObject *parent) : QObject(parent) {}

void DoricBridgeExtension::callNative(QString contextId, QString module,
                                      QString methodName, QString callbackId,
                                      QString argument) {
  DoricContext *context =
      DoricContextManager::getInstance()->getContext(contextId);
  bool classRegistered =
      context->getDriver()->getRegistry()->acquirePluginInfo(module);
  if (classRegistered) {
    QObject *plugin = context->obtainPlugin(module);
    QMetaObject::invokeMethod(plugin, methodName.toUtf8(), Qt::DirectConnection,
                              QGenericReturnArgument(),
                              Q_ARG(QString, argument),
                              Q_ARG(QString, callbackId));
  }
  qDebug() << "contextId: " + contextId << "module: " + module
           << "methodName: " + methodName << "callbackId: " + callbackId
           << "jsValue: " + argument;
}
