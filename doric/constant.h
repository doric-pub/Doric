#ifndef CONSTANT_H
#define CONSTANT_H

#include <QString>

class Constant {

public:
    static const QString INJECT_LOG;
    static const QString INJECT_REQUIRE;
    static const QString INJECT_TIMER_SET;
    static const QString INJECT_TIMER_CLEAR;
    static const QString INJECT_BRIDGE;
    static const QString INJECT_EMPTY;

    static const QString TEMPLATE_CONTEXT_CREATE;
    static const QString TEMPLATE_MODULE;
    static const QString TEMPLATE_CONTEXT_DESTROY;

    static const QString GLOBAL_DORIC;
    static const QString DORIC_CONTEXT_INVOKE;
    static const QString DORIC_TIMER_CALLBACK;

    static const QString DORIC_ENTITY_INIT;
    static const QString DORIC_ENTITY_SHOW;
};

#endif // CONSTANT_H
