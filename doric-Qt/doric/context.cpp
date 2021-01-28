#include "context.h"
#include "native_driver.h"

Context::Context(QString contextId, QString source, QString extra)
{
    this->mContextId = contextId;
    this->source = source;
    this->extra = extra;
}

InterfaceDriver* Context::getDriver()
{
    if (driver == NULL)
    {
        driver = NativeDriver::getInstance();
        return driver;
    }
    return driver;
}
