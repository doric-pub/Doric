#include "native_empty.h"
#include <QDebug>

Q_INVOKABLE QJSValue NativeEmpty::function() {
    qDebug() << "nativeEmpty";
    return QJSValue::NullValue;
}
