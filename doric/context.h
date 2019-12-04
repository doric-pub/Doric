#ifndef CONTEXT_H
#define CONTEXT_H

#include <QString>
#include "driver/driver.h"
#include "driver/native_driver.h"

class Context
{

private:
    int contextId;
    QString* source;

public:
    Driver* driver = NativeDriver::getInstance();

    Context(int contextId, QString* source) {
        this->contextId = contextId;
        this->source = source;
    }
};

#endif // CONTEXT_H
