#ifndef DORICPOPOVERPLUGIN_H
#define DORICPOPOVERPLUGIN_H

#include "DoricNativePlugin.h"

#include <QQuickItem>

static QString TYPE = "popover";

class DoricPopoverPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void show(QString jsValueString, QString callbackId);

  Q_INVOKABLE void dismiss(QString jsValueString, QString callbackId);

private:
  QQuickItem *fullScreenView = nullptr;

  void dismissViewNode(DoricViewNode *node);

  void dismissPopover();
};

#endif // DORICPOPOVERPLUGIN_H
