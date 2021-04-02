#include "DoricNativeRequire.h"

#include <QDebug>

Q_INVOKABLE void DoricNativeRequire::function(QString name) {
  qDebug() << "nativeRequire: " << name.toUtf8();
}
