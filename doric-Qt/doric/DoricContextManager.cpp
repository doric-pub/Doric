#include "DoricContextManager.h"

DoricContext *DoricContextManager::createContext(QString script, QString source,
                                                 QString extra) {
  int contextId = counter->fetchAndAddOrdered(1);
  DoricContext *context =
      new DoricContext(QString::number(contextId), source, extra);
  contextMap->insert(QString::number(contextId), context);
  context->getDriver()->createContext(QString::number(contextId), script,
                                      source);
  return context;
}

DoricContext *DoricContextManager::getContext(QString contextId) {
  return contextMap->take(contextId);
}
