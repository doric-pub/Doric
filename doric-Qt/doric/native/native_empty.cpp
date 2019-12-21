#include <QDebug>

#include "native_empty.h"

Q_INVOKABLE void NativeEmpty::function() {
    qDebug() << "nativeEmpty";
}
