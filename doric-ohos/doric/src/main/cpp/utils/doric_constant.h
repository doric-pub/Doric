#pragma once

#include <string>

class DoricConstant {

public:
    static const std::string DORIC_BUNDLE_SANDBOX;
    static const std::string DORIC_BUNDLE_LIB;
    static const std::string DORIC_MODULE_LIB;

    static const std::string INJECT_ENVIRONMENT;
    static const std::string INJECT_LOG;
    static const std::string INJECT_REQUIRE;
    static const std::string INJECT_TIMER_SET;
    static const std::string INJECT_TIMER_CLEAR;
    static const std::string INJECT_BRIDGE;

    static const std::string TEMPLATE_CONTEXT_CREATE;
    static const std::string TEMPLATE_MODULE;
    static const std::string TEMPLATE_CONTEXT_DESTROY;

    static const std::string GLOBAL_DORIC;
    static const std::string DORIC_CONTEXT_INVOKE;
    static const std::string DORIC_CONTEXT_INVOKE_PURE;
    static const std::string DORIC_TIMER_CALLBACK;
    static const std::string DORIC_BRIDGE_RESOLVE;
    static const std::string DORIC_BRIDGE_REJECT;
    static const std::string DORIC_HOOK_NATIVE_CALL;

    static const std::string DORIC_ENTITY_RESPONSE;
    static const std::string DORIC_ENTITY_CREATE;
    static const std::string DORIC_ENTITY_INIT;
    static const std::string DORIC_ENTITY_BUILD;
    static const std::string DORIC_ENTITY_DESTROY;
};