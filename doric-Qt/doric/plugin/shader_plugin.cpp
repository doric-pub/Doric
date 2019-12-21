#include "shader_plugin.h"

Q_INVOKABLE void ShaderPlugin::render(QJSValue jsValue) {
    QString viewId = jsValue.property("id").toString();
    qDebug() << viewId;
}
