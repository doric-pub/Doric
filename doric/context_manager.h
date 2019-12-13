#ifndef CONTEXT_MANAGER_H
#define CONTEXT_MANAGER_H

#include <QAtomicInt>
#include <QDebug>
#include <QMap>

#include "context.h"

class ContextManager
{
private:

    static ContextManager *local_instance;
    ContextManager() {
        qDebug() << "ContextManager constructor";
    }

    ~ContextManager() {
        qDebug() << "ContextManager destructor";
    }

    QAtomicInt *counter = new QAtomicInt();
    QMap<int, Context*> *contextMap = new QMap<int, Context*>();

public:
    static ContextManager *getInstance() {
        static ContextManager locla_s;
        return &locla_s;
    }

    Context *createContext(QString *script, QString *source) {
        int contextId = counter->fetchAndAddOrdered(1);
        Context *context = new Context(contextId, source);
        contextMap->insert(contextId, context);
        context->driver->createContext(contextId, script);
        return context;
    }

    Context *getContext(int contextId) {
        return contextMap->take(contextId);
    }
};

#endif // CONTEXT_MANAGER_H
