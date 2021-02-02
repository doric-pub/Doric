#include <functional>

#include "native_driver.h"
#include "async/async_call.h"
#include "utils/constant.h"

void NativeDriver::invokeContextEntityMethod(QString contextId, QString method, QVariantList args)
{
    args.insert(0, QVariant(contextId));
    args.insert(1, QVariant(method));
    invokeDoricMethod(Constant::DORIC_CONTEXT_INVOKE, args);
}

void NativeDriver::invokeDoricMethod(QString method, QVariantList args)
{
    return AsyncCall::ensureRunInThreadPool(&jsEngine.mJSThreadPool, [this, method, args]{
        qDebug() << "invokeDoricMethod: " << this->jsEngine.invokeDoricMethod(method, args).toString();
    });
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
