#ifndef DORICJSLOADERMANAGER_H
#define DORICJSLOADERMANAGER_H

#include <QDebug>

#include "DoricInterfaceLoader.h"

class DoricJSLoaderManager {
private:
  static DoricJSLoaderManager *local_instance;

  DoricJSLoaderManager();

  ~DoricJSLoaderManager() { qDebug() << "DoricJSLoaderManager destructor"; }

public:
  static DoricJSLoaderManager *getInstance() {
    static DoricJSLoaderManager instance;
    return &instance;
  }

private:
  QSet<DoricInterfaceLoader *> jsLoaders;

public:
  void addJSLoader(DoricInterfaceLoader *jsLoader);

  QSet<DoricInterfaceLoader *> *getJSLoaders();

  std::shared_ptr<DoricAsyncResult> request(QString source);
};

#endif // DORICJSLOADERMANAGER_H
