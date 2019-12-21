#include <QDebug>

#include "registry.h"
#include "plugin/shader_plugin.h"

Registry::Registry() {
    registerNativePlugin("shader", typeid(ShaderPlugin).name());
}

void Registry::registerNativePlugin(QString key, QString value) {
    qDebug() << key + " " + value;
    pluginInfoMap.insert(key, value);
}

QString Registry::acquirePluginInfo(QString key) {
    return pluginInfoMap.take(key);
}
