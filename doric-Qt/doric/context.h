#ifndef CONTEXT_H
#define CONTEXT_H

#include <QString>

#include "interface_driver.h"

class Context
{
private:
    QString mContextId;
    QString source;
    QString script;
    QString extra;
    InterfaceDriver *driver = NULL;

public:
    Context(QString contextId, QString source, QString extra);

    static Context* create(QString script, QString source, QString extra)
    {
        return NULL;
    }

    InterfaceDriver* getDriver();
};

#endif // CONTEXT_H
