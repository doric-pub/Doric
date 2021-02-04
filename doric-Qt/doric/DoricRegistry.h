#ifndef REGISTRY_H
#define REGISTRY_H

#include <QString>

#include "utils/DoricObjectFactory.h"

class DoricRegistry {
public:
  DoricObjectFactory pluginInfoMap;

  DoricRegistry();

  template <typename T> void registerNativePlugin(QString name) {
    pluginInfoMap.registerClass<T>(name);
  }

  bool acquirePluginInfo(QString name);
};

#endif // REGISTRY_H
