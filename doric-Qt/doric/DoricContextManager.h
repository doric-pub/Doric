#ifndef CONTEXTMANAGER_H
#define CONTEXTMANAGER_H

#include <QDebug>

#include "DoricContext.h"

class DoricContextManager {
private:
  static DoricContextManager *local_instance;
  DoricContextManager() {}

  ~DoricContextManager() {}

  QAtomicInt *counter = new QAtomicInt();
  QMap<QString, DoricContext *> *contextMap =
      new QMap<QString, DoricContext *>();

public:
  static DoricContextManager *getInstance() {
    static DoricContextManager instance;
    return &instance;
  }

  DoricContext *createContext(QString script, QString source, QString extra);

  DoricContext *getContext(QString contextId);
};

#endif // CONTEXTMANAGER_H
