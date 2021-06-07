#ifndef CONTEXTMANAGER_H
#define CONTEXTMANAGER_H

#include <QDebug>

#include "DoricExport.h"

#include "DoricContext.h"

class DORIC_EXPORT DoricContextManager {
private:
  static DoricContextManager *local_instance;
  DoricContextManager() { qDebug() << "DoricContextManager constructor"; }

  ~DoricContextManager() { qDebug() << "DoricContextManager destructor"; }

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

  void destroyContext(DoricContext *context);
};

#endif // CONTEXTMANAGER_H
