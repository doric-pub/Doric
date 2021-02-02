#ifndef NATIVE_REQUIRE_H
#define NATIVE_REQUIRE_H


#include <QObject>
#include <QJSValue>

class NativeRequire : public QObject {
    Q_OBJECT

public:
    NativeRequire(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE QJSValue function(QString name);
};


#endif // NATIVE_REQUIRE_H
