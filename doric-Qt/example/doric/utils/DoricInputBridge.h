#ifndef DORICINPUTBRIDGE_H
#define DORICINPUTBRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricInputBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricInputBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onTextChange(QString pointer, QString text);

  Q_INVOKABLE
  void onFocusChange(QString pointer);
signals:
};

#endif // DORICINPUTBRIDGE_H
