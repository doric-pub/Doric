#ifndef NATIVE_BRIDGE_H
#define NATIVE_BRIDGE_H

#include <QDebug>
#include <QJSValue>
#include <QObject>

class NativeBridge : public QObject {
    Q_OBJECT

public:
    NativeBridge(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE void function(int contextId, QString module, QString methodName, QString callbackId, QJSValue jsValue);
};

#endif // NATIVE_BRIDGE_H
