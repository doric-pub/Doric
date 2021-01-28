#ifndef NATIVE_LOG_H
#define NATIVE_LOG_H

#include <QObject>

class NativeLog : public QObject {
    Q_OBJECT

public:
    NativeLog(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE void function(QString level, QString content);
};

#endif // NATIVE_LOG_H
