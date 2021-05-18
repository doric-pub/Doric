#ifndef NATIVEEMPTY_H
#define NATIVEEMPTY_H

#include <QObject>

#include "DoricExport.h"

class DORIC_EXPORT DoricNativeEmpty : public QObject {
  Q_OBJECT

public:
  DoricNativeEmpty(QObject *parent = nullptr) : QObject(parent) {}

  Q_INVOKABLE void function();
};

#endif // NATIVEEMPTY_H
