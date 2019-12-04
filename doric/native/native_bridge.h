#ifndef NATIVE_BRIDGE_H
#define NATIVE_BRIDGE_H

#include <QObject>
#include <QDebug>

class NativeBridge : public QObject {
    Q_OBJECT

public:
    NativeBridge(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE void function(int contextId) {
        qDebug() << contextId;
    }
};

#endif // NATIVE_BRIDGE_H
