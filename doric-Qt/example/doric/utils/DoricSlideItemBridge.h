#ifndef DORICSLIDEITEMBRIDGE_H
#define DORICSLIDEITEMBRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricSlideItemBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricSlideItemBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void apply(QString pointer);
signals:
};

#endif // DORICSLIDEITEMBRIDGE_H
