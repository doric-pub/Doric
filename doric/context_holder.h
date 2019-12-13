#ifndef CONTEXT_HOLDER_H
#define CONTEXT_HOLDER_H

#include "context.h"

class ContextHolder {

public:
    Context *_context;

public:
    ContextHolder(Context *context) {
        this->_context = context;
    }
};

#endif // CONTEXT_HOLDER_H
