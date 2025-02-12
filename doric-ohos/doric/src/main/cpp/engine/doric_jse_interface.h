#pragma once

#include "ark_runtime/jsvm.h"
#include <map>
#include <string>

class DoricJSEInterface {
public:
    virtual JSVM_Value loadJS(std::string script, std::string source) = 0;

    virtual JSVM_Value injectGlobalJSObject(std::string name,
                                            std::map<std::string, std::variant<double, std::string>> object) = 0;

    virtual std::string invokeObject(std::string object_name, std::string function_name) = 0;
};