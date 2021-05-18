#ifndef NATIVE_REQUIRE_H
#define NATIVE_REQUIRE_H

#include <QObject>

#include "DoricExport.h"

class DORIC_EXPORT DoricNativeRequire : public QObject {
  Q_OBJECT

public:
  DoricNativeRequire(QObject *parent = nullptr) : QObject(parent) {}

  Q_INVOKABLE void function(QString name);
};

#endif // NATIVE_REQUIRE_H
