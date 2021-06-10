#ifndef DORICNAVBARPLUGIN_H
#define DORICNAVBARPLUGIN_H

#include <QQuickItem>

#include "DoricExport.h"

#include "DoricNativePlugin.h"

static QString TYPE_LEFT = "navbar_left";
static QString TYPE_RIGHT = "navbar_right";
static QString TYPE_CENTER = "navbar_center";

class DORIC_EXPORT DoricNavBarPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void isHidden(QString jsValueString, QString callbackId);

  Q_INVOKABLE void setHidden(QString jsValueString, QString callbackId);

  Q_INVOKABLE void setTitle(QString jsValueString, QString callbackId);

  Q_INVOKABLE void setBgColor(QString jsValueString, QString callbackId);

  Q_INVOKABLE void setLeft(QString jsValueString, QString callbackId);

  Q_INVOKABLE void setRight(QString jsValueString, QString callbackId);

  Q_INVOKABLE void setCenter(QString jsValueString, QString callbackId);
};

#endif // DORICNAVBARPLUGIN_H
