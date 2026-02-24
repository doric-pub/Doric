#pragma once

#include "../utils/doric_constant.h"
#include "../utils/doric_utils.h"
#include "ark_runtime/jsvm.h"
#include "doric_jse_interface.h"
#include <hilog/log.h>
#include <string>
#include <vector>

/**
 * DoricNativeJSExecutor - JSVM C-API based JS Executor.
 *
 * Aligned with iOS DoricJSCoreExecutor, implements DoricJSEInterface (the OHOS
 * counterpart of DoricJSExecutorProtocol).
 *
 * Uses HarmonyOS JSVM C-API (ark_runtime/jsvm.h).
 */
class DoricNativeJSExecutor : public DoricJSEInterface {

public:
    DoricNativeJSExecutor() { createVM(); }

    ~DoricNativeJSExecutor() override { teardown(); }

    // ======================================================================
    // DoricJSEInterface implementation
    // ======================================================================

    /**
     * Load and execute a JS script.
     * Aligned with iOS: - (NSString *)loadJSScript:(NSString *)script source:(NSString *)source;
     */
    std::string loadJS(const std::string &script, const std::string &source) override {
        if (!env_) {
            return "";
        }
        JSVM_HandleScope handleScope;
        OH_JSVM_OpenHandleScope(env_, &handleScope);

        std::string resultStr;

        JSVM_Value sourceCodeValue = nullptr;
        OH_JSVM_CreateStringUtf8(env_, script.c_str(), script.size(), &sourceCodeValue);

        JSVM_Script jsVmScript;
        JSVM_ScriptOrigin scriptOrigin;
        memset(&scriptOrigin, 0, sizeof(scriptOrigin));
        scriptOrigin.resourceName = source.c_str();
        scriptOrigin.sourceMapUrl = nullptr;
        scriptOrigin.resourceLineOffset = 0;
        scriptOrigin.resourceColumnOffset = 0;

        JSVM_Status compileStatus =
            OH_JSVM_CompileScriptWithOrigin(env_, sourceCodeValue, nullptr, 0, true, nullptr, &scriptOrigin, &jsVmScript);
        if (compileStatus != JSVM_OK) {
            handleException("CompileScript");
            OH_JSVM_CloseHandleScope(env_, handleScope);
            return "";
        }

        JSVM_Value jsVmResult = nullptr;
        JSVM_Status runStatus = OH_JSVM_RunScript(env_, jsVmScript, &jsVmResult);
        if (runStatus != JSVM_OK) {
            handleException("RunScript");
        } else if (jsVmResult != nullptr) {
            resultStr = jsValueToString(jsVmResult);
        }

        OH_JSVM_CloseHandleScope(env_, handleScope);
        return resultStr;
    }

    /**
     * Inject a global JS object (key-value dictionary).
     * Aligned with iOS: - (void)injectGlobalJSObject:(NSString *)name obj:(id)obj;  (NSDictionary variant)
     */
    void injectGlobalJSObject(const std::string &name,
                              const std::map<std::string, std::variant<double, std::string>> &map) override {
        if (!env_) {
            return;
        }
        JSVM_HandleScope handleScope;
        OH_JSVM_OpenHandleScope(env_, &handleScope);

        JSVM_Value object = nullptr;
        OH_JSVM_CreateObject(env_, &object);

        for (const auto &[key, value] : map) {
            JSVM_Value jsKey = nullptr;
            OH_JSVM_CreateStringUtf8(env_, key.c_str(), JSVM_AUTO_LENGTH, &jsKey);

            if (std::holds_alternative<double>(value)) {
                JSVM_Value jsVal = nullptr;
                OH_JSVM_CreateDouble(env_, std::get<double>(value), &jsVal);
                OH_JSVM_SetProperty(env_, object, jsKey, jsVal);
            } else if (std::holds_alternative<std::string>(value)) {
                const std::string &strVal = std::get<std::string>(value);
                JSVM_Value jsVal = nullptr;
                OH_JSVM_CreateStringUtf8(env_, strVal.c_str(), JSVM_AUTO_LENGTH, &jsVal);
                OH_JSVM_SetProperty(env_, object, jsKey, jsVal);
            }
        }

        JSVM_Value global = nullptr;
        OH_JSVM_GetGlobal(env_, &global);
        JSVM_Value nameKey = nullptr;
        OH_JSVM_CreateStringUtf8(env_, name.c_str(), JSVM_AUTO_LENGTH, &nameKey);
        OH_JSVM_SetProperty(env_, global, nameKey, object);

        OH_JSVM_CloseHandleScope(env_, handleScope);
    }

    /**
     * Inject a global JS function.
     * Aligned with iOS: - (void)injectGlobalJSObject:(NSString *)name obj:(id)obj;  (block/callback variant)
     */
    void injectGlobalJSFunction(const std::string &name, DoricJSVMCallbackFn callback, void *data) override {
        if (!env_) {
            return;
        }
        JSVM_HandleScope handleScope;
        OH_JSVM_OpenHandleScope(env_, &handleScope);

        // Create callback struct - we need to keep it alive, allocate on heap
        auto *cbStruct = new JSVM_CallbackStruct();
        cbStruct->callback = callback;
        cbStruct->data = data;
        callbackRegistry_.push_back(cbStruct);

        JSVM_Value function = nullptr;
        OH_JSVM_CreateFunction(env_, name.c_str(), name.size(), cbStruct, &function);

        JSVM_Value global = nullptr;
        OH_JSVM_GetGlobal(env_, &global);
        JSVM_Value nameKey = nullptr;
        OH_JSVM_CreateStringUtf8(env_, name.c_str(), JSVM_AUTO_LENGTH, &nameKey);
        OH_JSVM_SetProperty(env_, global, nameKey, function);

        OH_JSVM_CloseHandleScope(env_, handleScope);
    }

    /**
     * Invoke a method on a global JS object with string arguments.
     * Aligned with iOS: - (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args;
     */
    std::string invokeObject(const std::string &objectName, const std::string &functionName,
                             const std::vector<std::string> &args) override {
        if (!env_) {
            return "";
        }
        JSVM_HandleScope handleScope;
        OH_JSVM_OpenHandleScope(env_, &handleScope);

        std::string resultStr;

        // Get global object
        JSVM_Value global = nullptr;
        OH_JSVM_GetGlobal(env_, &global);

        // Get the target object (e.g., "doric")
        JSVM_Value objNameKey = nullptr;
        OH_JSVM_CreateStringUtf8(env_, objectName.c_str(), JSVM_AUTO_LENGTH, &objNameKey);
        JSVM_Value targetObj = nullptr;
        OH_JSVM_GetProperty(env_, global, objNameKey, &targetObj);

        if (targetObj == nullptr) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "invokeObject: object '%{public}s' not found", objectName.c_str());
            OH_JSVM_CloseHandleScope(env_, handleScope);
            return "";
        }

        // Get the function
        JSVM_Value funcNameKey = nullptr;
        OH_JSVM_CreateStringUtf8(env_, functionName.c_str(), JSVM_AUTO_LENGTH, &funcNameKey);
        JSVM_Value func = nullptr;
        OH_JSVM_GetProperty(env_, targetObj, funcNameKey, &func);

        // Check if it's a function
        JSVM_ValueType funcType;
        OH_JSVM_Typeof(env_, func, &funcType);
        if (funcType != JSVM_FUNCTION) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "invokeObject: '%{public}s.%{public}s' is not a function",
                         objectName.c_str(), functionName.c_str());
            OH_JSVM_CloseHandleScope(env_, handleScope);
            return "";
        }

        // Prepare arguments
        std::vector<JSVM_Value> jsArgs(args.size());
        for (size_t i = 0; i < args.size(); i++) {
            OH_JSVM_CreateStringUtf8(env_, args[i].c_str(), JSVM_AUTO_LENGTH, &jsArgs[i]);
        }

        // Call the function
        JSVM_Value result = nullptr;
        JSVM_Status callStatus = OH_JSVM_CallFunction(env_, targetObj, func,
                                                       jsArgs.size(), jsArgs.empty() ? nullptr : jsArgs.data(),
                                                       &result);
        if (callStatus != JSVM_OK) {
            handleException("invokeObject");
        } else if (result != nullptr) {
            resultStr = jsValueToString(result);
        }

        OH_JSVM_CloseHandleScope(env_, handleScope);
        return resultStr;
    }

    /**
     * Teardown and release all JSVM resources.
     */
    void teardown() override {
        if (!env_) {
            return;
        }

        // Clean up callback registry
        for (auto *cb : callbackRegistry_) {
            delete cb;
        }
        callbackRegistry_.clear();

        OH_JSVM_CloseEnvScope(env_, envScope_);
        OH_JSVM_DestroyEnv(env_);
        env_ = nullptr;
        OH_JSVM_CloseVMScope(vm_, vmScope_);
        OH_JSVM_DestroyVM(vm_);
        vm_ = nullptr;
    }

    /**
     * Get the raw JSVM_Env for advanced operations.
     */
    JSVM_Env getEnv() const { return env_; }

private:
    JSVM_VM vm_ = nullptr;
    JSVM_VMScope vmScope_ = nullptr;
    JSVM_Env env_ = nullptr;
    JSVM_EnvScope envScope_ = nullptr;
    std::vector<JSVM_CallbackStruct *> callbackRegistry_;

    void createVM() {
        JSVM_InitOptions initOptions;
        memset(&initOptions, 0, sizeof(initOptions));
        initOptions.externalReferences = nullptr;
        OH_JSVM_Init(&initOptions);

        JSVM_CreateVMOptions vmOptions;
        memset(&vmOptions, 0, sizeof(vmOptions));
        OH_JSVM_CreateVM(&vmOptions, &vm_);
        OH_JSVM_OpenVMScope(vm_, &vmScope_);

        // Create env without pre-registered descriptors; functions are injected dynamically
        JSVM_Status status = OH_JSVM_CreateEnv(vm_, 0, nullptr, &env_);
        if (status != JSVM_OK) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "OH_JSVM_CreateEnv failed with status %{public}d", static_cast<int>(status));
            return;
        }
        OH_JSVM_OpenEnvScope(env_, &envScope_);
    }

    /**
     * Convert a JSVM_Value to a std::string.
     * Handles string, number, boolean, undefined, null, and falls back to JSON.stringify.
     */
    std::string jsValueToString(JSVM_Value value) {
        if (value == nullptr) {
            return "";
        }

        JSVM_ValueType type;
        OH_JSVM_Typeof(env_, value, &type);

        switch (type) {
        case JSVM_STRING:
            return DoricUtils::GetValueString(env_, value);

        case JSVM_NUMBER: {
            double num;
            OH_JSVM_GetValueDouble(env_, value, &num);
            // Return integer format if possible
            if (num == static_cast<int64_t>(num)) {
                return std::to_string(static_cast<int64_t>(num));
            }
            return std::to_string(num);
        }

        case JSVM_BOOLEAN: {
            bool val;
            OH_JSVM_GetValueBool(env_, value, &val);
            return val ? "true" : "false";
        }

        case JSVM_UNDEFINED:
            return "undefined";

        case JSVM_NULL:
            return "null";

        case JSVM_OBJECT: {
            // Use JSON.stringify for objects/arrays
            JSVM_Value global = nullptr;
            OH_JSVM_GetGlobal(env_, &global);
            JSVM_Value jsonKey = nullptr;
            OH_JSVM_CreateStringUtf8(env_, "JSON", JSVM_AUTO_LENGTH, &jsonKey);
            JSVM_Value jsonObj = nullptr;
            OH_JSVM_GetProperty(env_, global, jsonKey, &jsonObj);
            JSVM_Value stringifyKey = nullptr;
            OH_JSVM_CreateStringUtf8(env_, "stringify", JSVM_AUTO_LENGTH, &stringifyKey);
            JSVM_Value stringifyFunc = nullptr;
            OH_JSVM_GetProperty(env_, jsonObj, stringifyKey, &stringifyFunc);

            JSVM_Value result = nullptr;
            JSVM_Value args[] = {value};
            JSVM_Status status = OH_JSVM_CallFunction(env_, jsonObj, stringifyFunc, 1, args, &result);
            if (status == JSVM_OK && result != nullptr) {
                return DoricUtils::GetValueString(env_, result);
            }
            return "[object]";
        }

        default:
            return "";
        }
    }

    /**
     * Handle JS exceptions: log and clear.
     */
    void handleException(const std::string &context) {
        JSVM_Value exceptionValue = nullptr;
        JSVM_Status status = OH_JSVM_GetAndClearLastException(env_, &exceptionValue);
        if (status == JSVM_OK && exceptionValue != nullptr) {
            JSVM_Value message = nullptr;
            OH_JSVM_GetNamedProperty(env_, exceptionValue, "message", &message);
            if (message != nullptr) {
                std::string errMsg = DoricUtils::GetValueString(env_, message);
                OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                             "%{public}s exception: %{public}s", context.c_str(), errMsg.c_str());
            }

            // Also try to get stack trace
            JSVM_Value stack = nullptr;
            OH_JSVM_GetNamedProperty(env_, exceptionValue, "stack", &stack);
            if (stack != nullptr) {
                JSVM_ValueType stackType;
                OH_JSVM_Typeof(env_, stack, &stackType);
                if (stackType == JSVM_STRING) {
                    std::string stackStr = DoricUtils::GetValueString(env_, stack);
                    OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                                 "%{public}s stack: %{public}s", context.c_str(), stackStr.c_str());
                }
            }
        }
    }
};
