#include "native_require.h"

#include <QDebug>

Q_INVOKABLE QJSValue NativeRequire::function(QString name) {
    qDebug() << "nativeRequire";
    return QJSValue::NullValue;
}
