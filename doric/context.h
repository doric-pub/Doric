#ifndef CONTEXT_H
#define CONTEXT_H

#include <QString>

#include "driver/driver.h"

class Context
{

private:
    int contextId;
    QString *source;

public:
    Driver *driver;

    Context(int contextId, QString *source);

    void show();

    void init(double width, double height);
};

#endif // CONTEXT_H
