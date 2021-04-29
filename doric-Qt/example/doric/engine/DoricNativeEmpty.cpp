#include "DoricNativeEmpty.h"
#include <QDebug>

Q_INVOKABLE void DoricNativeEmpty::function() {
  qDebug() << "nativeEmpty";
}
