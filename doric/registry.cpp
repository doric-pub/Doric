#include <QDebug>

#include "registry.h"

Registry::Registry() {
    registerNativePlugin(typeid(ShaderPlugin).name());
}

void Registry::registerNativePlugin(QString name) {
    qDebug() << name;
}
