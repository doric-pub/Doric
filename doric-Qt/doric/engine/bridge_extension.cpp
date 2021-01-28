#include <QDebug>
#include "bridge_extension.h"

BridgeExtension::BridgeExtension(QObject *parent) : QObject(parent)
{

}

void BridgeExtension::callNative(QString contextId, QString module, QString methodName, QString callbackId, QJSValue jsValue)
{
    qDebug() << "contextId: " + contextId;
    qDebug() << "module: " + module;
    qDebug() << "methodName: " + methodName;
    qDebug() << "callbackId: " + callbackId;
    qDebug() << "jsValue: " + jsValue.toString();
}
