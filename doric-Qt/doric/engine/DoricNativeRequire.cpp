#include "DoricNativeRequire.h"

#include <QDebug>

Q_INVOKABLE QJSValue DoricNativeRequire::function(QString name) {
  qDebug() << "nativeRequire";
  return QJSValue::NullValue;
}
