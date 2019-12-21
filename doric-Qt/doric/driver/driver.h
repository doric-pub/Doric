#ifndef DRIVER_H
#define DRIVER_H

#include <QtPlugin>

#include "registry.h"

class Driver {

public:
    virtual void createContext(int contextId, QString *script) = 0;
    virtual void destroyContext(int contextId) = 0;

    virtual void invokeContextEntityMethod(int contextId, QString *method, ...) = 0;
    virtual void invokeDoricMethod(QString *method, ...) = 0;

    virtual Registry *getRegistry() = 0;

    virtual ~Driver() = default;
};

#define DriverInterface "pub.doric.DriverInterface"

Q_DECLARE_INTERFACE(Driver, DriverInterface)

#endif // DRIVER_H
