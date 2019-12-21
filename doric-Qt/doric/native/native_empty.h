#ifndef NATIVE_EMPTY_H
#define NATIVE_EMPTY_H

#include <QObject>

class NativeEmpty : public QObject {
    Q_OBJECT

public:
    NativeEmpty(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE void function();
};

#endif // NATIVE_EMPTY_H
