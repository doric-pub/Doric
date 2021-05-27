#ifndef DORICSWITCHBRIDGE_H
#define DORICSWITCHBRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricSwitchBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricSwitchBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onSwitch(QString pointer, bool checked);
signals:
};

#endif // DORICSWITCHBRIDGE_H
