#ifndef DORICMODALPLUGIN_H
#define DORICMODALPLUGIN_H

#include "DoricExport.h"

#include "DoricNativePlugin.h"

class DORIC_EXPORT DoricModalPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void toast(QString jsValueString, QString callbackId);

  Q_INVOKABLE void alert(QString jsValueString, QString callbackId);

  Q_INVOKABLE void confirm(QString jsValueString, QString callbackId);

  Q_INVOKABLE void prompt(QString jsValueString, QString callbackId);

  void onAccepted(QString callbackId);

  void onAcceptedWithInput(QString callbackId, QString input);

  void onRejected(QString callbackId);

  void onRejectedWithInput(QString callbackId, QString input);
};

#endif // DORICMODALPLUGIN_H
