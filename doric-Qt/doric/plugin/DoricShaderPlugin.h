#ifndef SHADERPLUGIN_H
#define SHADERPLUGIN_H

#include <QJSValue>
#include <QObject>

#include "DoricNativePlugin.h"

class DoricShaderPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void render(QString jsValueString, QString callbackId);
};

#endif // SHADERPLUGIN_H
