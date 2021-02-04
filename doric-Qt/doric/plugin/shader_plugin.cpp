#include "shader_plugin.h"

#include <QDebug>

ShaderPlugin::ShaderPlugin(QObject* parent) : QObject (parent)
{

}

void ShaderPlugin::render(QJSValue jsValue, QString callbackId)
{
    qDebug() << "";
}
