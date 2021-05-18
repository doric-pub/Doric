#ifndef NATIVE_LOG_H
#define NATIVE_LOG_H

#include <QObject>

#include "DoricExport.h"

class DORIC_EXPORT DoricNativeLog : public QObject {
  Q_OBJECT

public:
  DoricNativeLog(QObject *parent = nullptr) : QObject(parent) {}

  Q_INVOKABLE void function(QString level, QString content);
};

#endif // NATIVE_LOG_H
