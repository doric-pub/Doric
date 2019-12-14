#include <QDebug>

#include "registry.h"
#include "plugin/shader_plugin.h"

Registry::Registry() {
    registerNativePlugin(typeid(ShaderPlugin).name());
}

void Registry::registerNativePlugin(QString name) {
    qDebug() << name;
}
