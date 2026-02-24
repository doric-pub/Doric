#pragma once

#include "ark_runtime/jsvm.h"
#include <functional>
#include <map>
#include <string>
#include <variant>
#include <vector>

// Native callback function pointer type matching JSVM_CallbackStruct::callback field
typedef JSVM_Value (*DoricJSVMCallbackFn)(JSVM_Env env, JSVM_CallbackInfo info);

/**
 * DoricJSEInterface - JS Executor Protocol
 *
 * Aligned with iOS DoricJSExecutorProtocol:
 *   - loadJSScript:source:
 *   - injectGlobalJSObject:obj:
 *   - invokeObject:method:args:
 */
class DoricJSEInterface {
public:
    virtual ~DoricJSEInterface() = default;

    /**
     * Load and execute a JS script with a source URL for debugging.
     * Aligned with iOS: - (NSString *)loadJSScript:(NSString *)script source:(NSString *)source;
     */
    virtual std::string loadJS(const std::string &script, const std::string &source) = 0;

    /**
     * Inject a global JS object (dictionary of key-value pairs) into the JS context.
     * Aligned with iOS: - (void)injectGlobalJSObject:(NSString *)name obj:(id)obj;
     * This variant handles NSDictionary-style objects.
     */
    virtual void injectGlobalJSObject(const std::string &name,
                                      const std::map<std::string, std::variant<double, std::string>> &object) = 0;

    /**
     * Inject a global JS function into the JS context.
     * Aligned with iOS: - (void)injectGlobalJSObject:(NSString *)name obj:(id)obj;
     * This variant handles block/callback-style objects.
     *
     * @param name      The global function name visible in JS
     * @param callback  Native C function pointer: JSVM_Value fn(JSVM_Env, JSVM_CallbackInfo)
     * @param data      Opaque pointer passed via JSVM_CallbackStruct::data, retrievable in callback
     */
    virtual void injectGlobalJSFunction(const std::string &name, DoricJSVMCallbackFn callback,
                                        void *data = nullptr) = 0;

    /**
     * Invoke a method on a global JS object with arguments.
     * Aligned with iOS: - (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args;
     *
     * @param objectName    The global JS object name (e.g., "doric")
     * @param functionName  The method name on that object
     * @param args          Array of string arguments to pass
     * @return The result as a string (JSON-serialized if needed)
     */
    virtual std::string invokeObject(const std::string &objectName, const std::string &functionName,
                                     const std::vector<std::string> &args) = 0;

    /**
     * Teardown and cleanup the JS executor.
     */
    virtual void teardown() = 0;
};
