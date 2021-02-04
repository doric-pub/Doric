#include "registry.h"

#include "plugin/shader_plugin.h"

Registry::Registry()
{
    registerNativePlugin<ShaderPlugin>("shader");
}

bool Registry::acquirePluginInfo(QString name)
{
    return pluginInfoMap.acquireClass(name);
}
