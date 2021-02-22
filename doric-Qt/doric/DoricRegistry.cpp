#include "DoricRegistry.h"

#include "plugin/DoricShaderPlugin.h"
#include "shader/DoricRootNode.h"
#include "shader/DoricStackNode.h"

DoricRegistry::DoricRegistry() {
  registerNativePlugin<DoricShaderPlugin>("shader");

  registerViewNode<DoricRootNode>("Root");
  registerViewNode<DoricStackNode>("Stack");
}

bool DoricRegistry::acquirePluginInfo(QString name) {
  return plugins.acquireClass(name);
}

bool DoricRegistry::acquireNodeInfo(QString name) {
  return nodes.acquireClass(name);
}
