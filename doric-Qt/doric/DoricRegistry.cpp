#include "DoricRegistry.h"

#include "plugin/DoricShaderPlugin.h"

DoricRegistry::DoricRegistry() {
  registerNativePlugin<DoricShaderPlugin>("shader");
}

bool DoricRegistry::acquirePluginInfo(QString name) {
  return plugins.acquireClass(name);
}
