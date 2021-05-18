#ifndef REGISTRY_H
#define REGISTRY_H

#include <QDebug>
#include <QString>

#include "DoricExport.h"

#include "utils/DoricObjectFactory.h"

class DoricLibrary;

class DORIC_EXPORT DoricRegistry {
private:
  static DoricRegistry *local_instance;

  ~DoricRegistry() { qDebug() << "destructor"; }

public:
  static DoricRegistry *getInstance() {
    static DoricRegistry instance;
    return &instance;
  }

  QSet<DoricLibrary *> doricLibraries;

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

  bool acquireNodeInfo(QString name);

  void registerLibrary(DoricLibrary *doricLibrary);
};

#endif // REGISTRY_H
