#ifndef REGISTRY_H
#define REGISTRY_H

#include <QString>

#include "utils/object_factory.h"

class Registry
{
public:
    ObjectFactory pluginInfoMap;

    Registry();

    template<typename T>
    void registerNativePlugin(QString name)
    {
        pluginInfoMap.registerClass<T>(name);
    }

    bool acquirePluginInfo(QString name);
};

#endif // REGISTRY_H
