#ifndef DORICNAVIGATORPLUGIN_H
#define DORICNAVIGATORPLUGIN_H

#include "DoricExport.h"

#include "DoricNativePlugin.h"

class DORIC_EXPORT DoricNavigatorPlugin : public DoricNativePlugin {
  Q_OBJECT

public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void push(QString jsValueString, QString callbackId);

  Q_INVOKABLE void pop(QString jsValueString, QString callbackId);

  Q_INVOKABLE void popSelf(QString jsValueString, QString callbackId);

  Q_INVOKABLE void popToRoot(QString jsValueString, QString callbackId);

  Q_INVOKABLE void openUrl(QString jsValueString, QString callbackId);
};

#endif // DORICNAVIGATORPLUGIN_H
