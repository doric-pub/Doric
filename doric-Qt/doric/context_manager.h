#ifndef CONTEXTMANAGER_H
#define CONTEXTMANAGER_H

#include <QDebug>

#include "context.h"

class ContextManager
{
private:
    static ContextManager *local_instance;
    ContextManager()
    {
        qDebug() << "ContextManager create";
    }

    ~ContextManager()
    {
        qDebug() << "ContextManager destroy";
    }

    QAtomicInt *counter = new QAtomicInt();
    QMap<QString, Context*> *contextMap = new QMap<QString, Context*>();

public:
    static ContextManager *getInstance()
    {
        static ContextManager instance;
        return &instance;
    }

    Context *createContext(QString script, QString source, QString extra) {
        int contextId = counter->fetchAndAddOrdered(1);
        Context *context = new Context(QString::number(contextId), source, extra);
        contextMap->insert(QString::number(contextId), context);
        context->driver->createContext(contextId, script);
        return context;
    }
};

#endif // CONTEXTMANAGER_H
