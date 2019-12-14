#ifndef CONTEXT_HOLDER_H
#define CONTEXT_HOLDER_H

#include "context.h"

class ContextHolder : public QObject {
    Q_OBJECT
public:
    Context *_context;

public:
    ContextHolder(Context *context, QObject *parent = nullptr) : QObject(parent) {
        this->_context = context;
    }
};

#endif // CONTEXT_HOLDER_H
