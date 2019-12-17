#include "shader_plugin.h"
#include "shader/view_node.h"

Q_INVOKABLE void ShaderPlugin::render(QJSValue jsValue) {
    QString viewId = jsValue.property("id").toString();
    ViewNode<QObject> *viewNode = new ViewNode<QObject>(nullptr);
}
