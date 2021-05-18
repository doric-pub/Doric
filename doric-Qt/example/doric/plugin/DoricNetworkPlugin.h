#ifndef DORICNETWORKPLUGIN_H
#define DORICNETWORKPLUGIN_H

#include "DoricExport.h"

#include "DoricNativePlugin.h"

class DORIC_EXPORT DoricNetworkPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void request(QString jsValueString, QString callbackId);
};
#endif // DORICNETWORKPLUGIN_H
