#ifndef NATIVEEMPTY_H
#define NATIVEEMPTY_H

#include <QObject>
#include <QJSValue>

class NativeEmpty : public QObject {
    Q_OBJECT

public:
    NativeEmpty(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE QJSValue function();
};

#endif // NATIVEEMPTY_H
