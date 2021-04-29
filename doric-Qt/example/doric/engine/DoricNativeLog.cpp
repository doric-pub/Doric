#include <QDebug>

#include "DoricNativeLog.h"

Q_INVOKABLE void DoricNativeLog::function(QString level, QString content) {
  if (level == 'w') {
    qWarning() << content;
  } else if (level == 'd') {
    qDebug() << content;
  } else if (level == 'e') {
    qCritical() << content;
  }
}
