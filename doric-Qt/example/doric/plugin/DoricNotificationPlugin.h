#ifndef DORICNOTIFICATIONPLUGIN_H
#define DORICNOTIFICATIONPLUGIN_H

#include "DoricExport.h"

#include "DoricNativePlugin.h"

class DORIC_EXPORT DoricNotificationPlugin : public DoricNativePlugin {
  Q_OBJECT

private:
  QList<QString> subscriptions;

public:
  using DoricNativePlugin::DoricNativePlugin;

  ~DoricNotificationPlugin();

  Q_INVOKABLE void publish(QString jsValueString, QString callbackId);

  Q_INVOKABLE void subscribe(QString jsValueString, QString callbackId);

  Q_INVOKABLE void unsubscribe(QString jsValueString, QString callbackId);
};
#endif // DORICNOTIFICATIONPLUGIN_H
