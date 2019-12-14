#include "context_manager.h"
#include "native_bridge.h"
#include "plugin/shader_plugin.h"

Q_INVOKABLE void NativeBridge::function(int contextId, QString module, QString methodName, QString callbackId, QJSValue jsValue) {
    qDebug() << "contextId: " + QString::number(contextId) + ", " +
                "module: " + module + ", " +
                "methodName: " + methodName + ", " +
                "callbackId: " + callbackId + ", " +
                "arguments: " + jsValue.toString();
    Context *context = ContextManager::getInstance()->getContext(contextId);
    QString value = context->driver->getRegistry()->acquirePluginInfo(module);

    qDebug() << value;
    if (value.contains("ShaderPlugin")) {
        ShaderPlugin shaderPlugin(context);
        QMetaObject::invokeMethod(&shaderPlugin, methodName.toStdString().c_str());
    }
}
