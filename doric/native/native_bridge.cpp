#include "context_manager.h"
#include "native_bridge.h"

Q_INVOKABLE void NativeBridge::function(int contextId, QString module, QString methodName, QString callbackId, QJSValue jsValue) {
    qDebug() << "contextId: " + QString::number(contextId) + ", " +
                "module: " + module + ", " +
                "methodName: " + methodName + ", " +
                "callbackId: " + callbackId + ", " +
                "arguments: " + jsValue.toString();
    Context* context = ContextManager::getInstance()->getContext(contextId);
}
