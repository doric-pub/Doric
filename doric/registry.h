#ifndef REGISTRY_H
#define REGISTRY_H

#include <QMap>
#include <QSet>

#include "plugin/shader_plugin.h"

class Registry {

private:
    QMap<QString, QString> pluginInfoMap;

public:
    Registry() {
        registerNativePlugin(typeid(ShaderPlugin).name());
    }

    void registerNativePlugin(QString name) {
        qDebug() << name;
    }
};

#endif // REGISTRY_H
