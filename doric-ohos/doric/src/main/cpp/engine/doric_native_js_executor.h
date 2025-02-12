#include "../utils/doric_constant.h"
#include "../utils/doric_utils.h"
#include "ark_runtime/jsvm.h"
#include "doric_jse_interface.h"
#include <hilog/log.h>

JSVM_Value NativeLog(JSVM_Env env, JSVM_CallbackInfo info) {
    size_t argc = 2;
    JSVM_Value args[2] = {nullptr};
    OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, nullptr);
    JSVM_Value jsVmType = args[0];
    JSVM_Value jsVmMessage = args[1];
    std::string type = DoricUtils::GetValueString(env, jsVmType);
    std::string message = DoricUtils::GetValueString(env, jsVmMessage);

    if (type.compare("d") == 0) {
        OH_LOG_Print(LOG_APP, LOG_DEBUG, 0x8000, "Doric", "NativeLog: %{public}s", message.c_str());
    } else if (type.compare("w") == 0) {
        OH_LOG_Print(LOG_APP, LOG_WARN, 0x8000, "Doric", "NativeLog: %{public}s", message.c_str());
    } else if (type.compare("e") == 0) {
        OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric", "NativeLog: %{public}s", message.c_str());
    }

    return nullptr;
}

JSVM_Value NativeRequire(JSVM_Env env, JSVM_CallbackInfo info) {
    size_t argc = 1;
    JSVM_Value args[1] = {nullptr};
    OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, nullptr);
    JSVM_Value jsVmName = args[0];
    std::string name = DoricUtils::GetValueString(env, jsVmName);

    OH_LOG_Print(LOG_APP, LOG_DEBUG, 0x8000, "Doric", "NativeRequire: %{public}s", name.c_str());

    return nullptr;
}

JSVM_Value NativeBridge(JSVM_Env env, JSVM_CallbackInfo info) {
    size_t argc = 5;
    JSVM_Value args[5] = {nullptr};
    OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, nullptr);
    JSVM_Value jsVmContextId = args[0];
    JSVM_Value jsVmModule = args[1];
    JSVM_Value jsVmMethod = args[2];
    JSVM_Value jsVmCallbackId = args[3];
    JSVM_Value jsVmValue = args[4];

    std::string contextId = DoricUtils::GetValueString(env, jsVmContextId);
    std::string module = DoricUtils::GetValueString(env, jsVmModule);
    std::string method = DoricUtils::GetValueString(env, jsVmMethod);
    std::string callbackId = DoricUtils::GetValueString(env, jsVmCallbackId);

    OH_LOG_Print(LOG_APP, LOG_DEBUG, 0x8000, "Doric", "NativeBridge: %{public}s", contextId.c_str());

    return nullptr;
}

static JSVM_CallbackStruct param[] = {
    {.callback = NativeLog, .data = nullptr},
    {.callback = NativeRequire, .data = nullptr},
    {.callback = NativeBridge, .data = nullptr},
};
static JSVM_CallbackStruct *method = param;
static JSVM_PropertyDescriptor descriptor[] = {
    {DoricConstant::INJECT_LOG.c_str(), nullptr, method++, nullptr, nullptr, nullptr, JSVM_DEFAULT},
    {DoricConstant::INJECT_REQUIRE.c_str(), nullptr, method++, nullptr, nullptr, nullptr, JSVM_DEFAULT},
    {DoricConstant::INJECT_BRIDGE.c_str(), nullptr, method++, nullptr, nullptr, nullptr, JSVM_DEFAULT},
};

class DoricNativeJSExecutor : public DoricJSEInterface {
protected:
    JSVM_VM vm;
    JSVM_VMScope vmScope;
    JSVM_Env env;
    JSVM_EnvScope envScope;

public:
    DoricNativeJSExecutor() { this->createVM(); }

    JSVM_Value loadJS(std::string script, std::string source) override {
        JSVM_HandleScope handleScope;
        OH_JSVM_OpenHandleScope(env, &handleScope);

        OH_LOG_Print(LOG_APP, LOG_INFO, 0x8000, "Doric", "JSVM API RunJsVm %{public}s", script.c_str());

        JSVM_Value jsVmResult;
        {
            JSVM_Value sourceCodeValue = nullptr;
            OH_JSVM_CreateStringUtf8(env, script.c_str(), script.size(), &sourceCodeValue);
            JSVM_Script jsVmScript;
            JSVM_ScriptOrigin scriptOrigin;
            scriptOrigin.sourceMapUrl = source.c_str();
            OH_JSVM_CompileScriptWithOrigin(env, sourceCodeValue, nullptr, 0, true, nullptr, &scriptOrigin,
                                            &jsVmScript);
            JSVM_Status res = OH_JSVM_RunScript(env, jsVmScript, &jsVmResult);
            if (res != JSVM_OK) {
                JSVM_Value exceptionValue;
                JSVM_Status status = OH_JSVM_GetAndClearLastException(env, &exceptionValue);
                if (status == JSVM_OK) {
                    JSVM_Value message;
                    OH_JSVM_GetNamedProperty(env, exceptionValue, "message", &message);
                    size_t length;
                    OH_JSVM_GetValueStringUtf8(env, message, nullptr, 0, &length);
                    char *buffer = new char[length + 1];
                    OH_JSVM_GetValueStringUtf8(env, message, buffer, length + 1, nullptr);
                    std::string result(buffer);
                    delete[] buffer;
                }
            } else {
            }
        }

        OH_JSVM_CloseHandleScope(env, handleScope);

        return jsVmResult;
    }

    JSVM_Value injectGlobalJSObject(std::string name,
                                    std::map<std::string, std::variant<double, std::string>> map) override {
        JSVM_HandleScope handleScope;
        OH_JSVM_OpenHandleScope(env, &handleScope);

        JSVM_Value object = nullptr;

        {
            OH_JSVM_CreateObject(env, &object);

            for (const auto &[key, value] : map) {
                JSVM_Value jsVmKey = nullptr;
                OH_JSVM_CreateStringUtf8(env, key.c_str(), JSVM_AUTO_LENGTH, &jsVmKey);

                if (std::holds_alternative<double>(value)) {
                    double doubleValue = std::get<double>(value);

                    JSVM_Value jsVmValue = nullptr;
                    OH_JSVM_CreateDouble(env, doubleValue, &jsVmValue);
                    OH_JSVM_SetProperty(env, object, jsVmKey, jsVmValue);
                } else if (std::holds_alternative<std::string>(value)) {
                    std::string stringValue = std::get<std::string>(value);

                    JSVM_Value jsVmValue = nullptr;
                    OH_JSVM_CreateStringUtf8(env, stringValue.c_str(), JSVM_AUTO_LENGTH, &jsVmValue);
                    OH_JSVM_SetProperty(env, object, jsVmKey, jsVmValue);
                }
            }

            JSVM_Value global = nullptr;
            OH_JSVM_GetGlobal(env, &global);
            JSVM_Value key = nullptr;
            OH_JSVM_CreateStringUtf8(env, name.c_str(), JSVM_AUTO_LENGTH, &key);
            OH_JSVM_SetProperty(env, global, key, object);
        }

        OH_JSVM_CloseHandleScope(env, handleScope);

        return nullptr;
    }

    std::string invokeObject(std::string object_name, std::string function_name) override { return ""; }

private:
    void createVM() {
        JSVM_InitOptions initOptions;
        memset(&initOptions, 0, sizeof(initOptions));
        initOptions.externalReferences = nullptr;
        OH_JSVM_Init(&initOptions);
        JSVM_CreateVMOptions options;
        memset(&options, 0, sizeof(options));

        OH_JSVM_CreateVM(&options, &vm);

        OH_JSVM_OpenVMScope(vm, &vmScope);
        JSVM_Status resultCode = OH_JSVM_CreateEnv(vm, sizeof(descriptor) / sizeof(descriptor[0]), descriptor, &env);
        if (resultCode != JSVM_OK) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric", "OH_JSVM_CreateEnv resultCode is %{public}d",
                         static_cast<int>(resultCode));
        }
        OH_JSVM_OpenEnvScope(env, &envScope);
    }
};