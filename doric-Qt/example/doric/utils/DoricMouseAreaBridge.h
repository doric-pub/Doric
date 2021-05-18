#ifndef DORICMOUSEAREABRIDGE_H
#define DORICMOUSEAREABRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricMouseAreaBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricMouseAreaBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onClick(QString pointer);
signals:
};

#endif // DORICMOUSEAREABRIDGE_H
