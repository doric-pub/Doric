#ifndef DORICNOTIFICATIONPLUGIN_H
#define DORICNOTIFICATIONPLUGIN_H

#include "DoricExport.h"

#include "DoricNativePlugin.h"

#include <QUdpSocket>

class DORIC_EXPORT DoricNotificationPlugin : public DoricNativePlugin {
  Q_OBJECT

private:
  QUdpSocket udpSocket;

public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void publish(QString jsValueString, QString callbackId);

  Q_INVOKABLE void subscribe(QString jsValueString, QString callbackId);

  Q_INVOKABLE void unsubscribe(QString jsValueString, QString callbackId);
};
#endif // DORICNOTIFICATIONPLUGIN_H
