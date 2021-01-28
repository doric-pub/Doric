#include "context.h"
#include "native_driver.h"
#include "context_manager.h"

Context::Context(QString contextId, QString source, QString extra)
{
    this->mContextId = contextId;
    this->source = source;
    this->extra = extra;
}

Context* Context::create(QString script, QString source, QString extra)
{
    Context *context = ContextManager::getInstance()->createContext(script, source, extra);
    context->script = script;
    return context;
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
