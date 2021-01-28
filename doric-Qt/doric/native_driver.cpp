#include "native_driver.h"
#include "async/async_call.h"

#include <functional>

void NativeDriver::invokeContextEntityMethod(QString contextId, QString method, QList<QObject> args)
{

}

void NativeDriver::invokeDoricMethod(QString method, QList<QObject> args)
{

}

void NativeDriver::createContext(QString contextId, QString script, QString source)
{
    AsyncCall::ensureRunInThreadPool(&jsEngine.mJSThreadPool, [this, contextId, script, source]{
        this->jsEngine.prepareContext(contextId, script, source);
    });
}

void NativeDriver::destroyContext(QString contextId)
{

}
