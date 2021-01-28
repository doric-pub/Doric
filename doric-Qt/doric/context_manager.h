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

    Context *createContext(QString script, QString source, QString extra);
};

#endif // CONTEXTMANAGER_H
