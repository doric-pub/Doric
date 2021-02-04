#ifndef NATIVE_REQUIRE_H
#define NATIVE_REQUIRE_H

#include <QJSValue>
#include <QObject>

class DoricNativeRequire : public QObject {
  Q_OBJECT

public:
  DoricNativeRequire(QObject *parent = nullptr) : QObject(parent) {}

  Q_INVOKABLE QJSValue function(QString name);
};

#endif // NATIVE_REQUIRE_H
