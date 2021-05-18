#ifndef SHADERPLUGIN_H
#define SHADERPLUGIN_H

#include "DoricExport.h"

#include "DoricNativePlugin.h"

class DORIC_EXPORT DoricShaderPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void render(QString jsValueString, QString callbackId);
};

#endif // SHADERPLUGIN_H
