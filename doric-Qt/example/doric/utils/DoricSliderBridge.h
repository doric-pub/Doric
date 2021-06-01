#ifndef DORICSLIDERBRIDGE_H
#define DORICSLIDERBRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricSliderBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricSliderBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onPageSlided(QString pointer);
};

#endif // DORICSLIDERBRIDGE_H
