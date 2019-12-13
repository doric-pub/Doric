#ifndef SHADER_PLUGIN_H
#define SHADER_PLUGIN_H

#include "context_holder.h"

class ShaderPlugin : public ContextHolder {

public:
    ShaderPlugin(Context* context) : ContextHolder(context) {}
};

#endif // SHADER_PLUGIN_H
