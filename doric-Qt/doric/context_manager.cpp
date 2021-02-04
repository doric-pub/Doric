#include "context_manager.h"

Context *ContextManager::createContext(QString script, QString source, QString extra)
{
    int contextId = counter->fetchAndAddOrdered(1);
    Context *context = new Context(QString::number(contextId), source, extra);
    contextMap->insert(QString::number(contextId), context);
    context->getDriver()->createContext(QString::number(contextId), script, source);
    return context;
}

Context *ContextManager::getContext(QString contextId)
{
    return contextMap->take(contextId);
}
