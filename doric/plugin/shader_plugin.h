#ifndef SHADER_PLUGIN_H
#define SHADER_PLUGIN_H

#include <QDebug>

#include "context_holder.h"

class ShaderPlugin : public ContextHolder {
    Q_OBJECT

public:
    ShaderPlugin(Context *context) : ContextHolder(context) {}

    Q_INVOKABLE void render() {
        qDebug() << "render";
    }
};

#endif // SHADER_PLUGIN_H
