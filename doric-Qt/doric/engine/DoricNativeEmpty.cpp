#include "DoricNativeEmpty.h"
#include <QDebug>

Q_INVOKABLE QJSValue DoricNativeEmpty::function() {
  qDebug() << "nativeEmpty";
  return QJSValue::NullValue;
}
