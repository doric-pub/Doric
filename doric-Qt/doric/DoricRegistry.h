#ifndef REGISTRY_H
#define REGISTRY_H

#include <QString>

#include "utils/DoricObjectFactory.h"

class DoricRegistry {
public:
  DoricObjectFactory plugins;
  DoricObjectFactory nodes;

  DoricRegistry();

  template <typename T> void registerNativePlugin(QString name) {
    plugins.registerClass<T>(name);
  }

  template <typename T> void registerViewNode(QString name) {
    nodes.registerClass<T>(name);
  }

  bool acquirePluginInfo(QString name);
};

#endif // REGISTRY_H
