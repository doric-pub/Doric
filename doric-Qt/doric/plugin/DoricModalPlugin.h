#ifndef DORICMODALPLUGIN_H
#define DORICMODALPLUGIN_H

#include "DoricNativePlugin.h"

class DoricModalPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void toast(QString jsValueString, QString callbackId);
};

#endif // DORICMODALPLUGIN_H
