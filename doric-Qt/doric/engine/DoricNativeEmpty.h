#ifndef NATIVEEMPTY_H
#define NATIVEEMPTY_H

#include <QJSValue>
#include <QObject>

class DoricNativeEmpty : public QObject {
  Q_OBJECT

public:
  DoricNativeEmpty(QObject *parent = nullptr) : QObject(parent) {}

  Q_INVOKABLE QJSValue function();
};

#endif // NATIVEEMPTY_H
