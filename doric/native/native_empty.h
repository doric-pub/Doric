#ifndef NATIVE_EMPTY_H
#define NATIVE_EMPTY_H

#include <QObject>
#include <QDebug>

class NativeEmpty : public QObject {
    Q_OBJECT

public:
    NativeEmpty(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE void function() {
        qDebug() << "nativeEmpty";
    }
};

#endif // NATIVE_EMPTY_H
