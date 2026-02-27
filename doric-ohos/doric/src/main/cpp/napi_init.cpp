#include "bridge/doric_bridge_callback.h"
#include "engine/doric_js_engine.h"
#include "napi/native_api.h"
#include "utils/doric_utils.h"
#include <hilog/log.h>
#include <string>

// Global DoricJSEngine instance
static DoricJSEngine *g_doricJSEngine = nullptr;

// ======================================================================
// Helper: extract std::string from napi_value
// ======================================================================
static std::string NapiGetString(napi_env env, napi_value value) {
    size_t len = 0;
    napi_get_value_string_utf8(env, value, nullptr, 0, &len);
    std::string result(len, '\0');
    napi_get_value_string_utf8(env, value, &result[0], len + 1, nullptr);
    return result;
}

// ======================================================================
// NAPI functions exposed to ArkTS side
// ======================================================================

/**
 * initDoric(resourceManager: ResourceManager): void
 *
 * Initialize the Doric engine with a resource manager for loading rawfile assets.
 */
static napi_value InitDoric(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[1] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    DoricUtils::GlobalNativeResourceManager = OH_ResourceManager_InitNativeResourceManager(env, argv[0]);

    if (g_doricJSEngine) {
        delete g_doricJSEngine;
    }
    g_doricJSEngine = new DoricJSEngine();

    napi_value result;
    napi_get_undefined(env, &result);
    return result;
}

/**
 * prepareContext(contextId: string, script: string, source: string): void
 *
 * Aligned with iOS: - (void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;
 */
static napi_value PrepareContext(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[3] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    if (argc < 3 || !g_doricJSEngine) {
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    std::string contextId = NapiGetString(env, argv[0]);
    std::string script = NapiGetString(env, argv[1]);
    std::string source = NapiGetString(env, argv[2]);

    g_doricJSEngine->prepareContext(contextId, script, source);

    napi_value undefined;
    napi_get_undefined(env, &undefined);
    return undefined;
}

/**
 * destroyContext(contextId: string): void
 *
 * Aligned with iOS: - (void)destroyContext:(NSString *)contextId;
 */
static napi_value DestroyContext(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[1] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    if (argc < 1 || !g_doricJSEngine) {
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    std::string contextId = NapiGetString(env, argv[0]);
    g_doricJSEngine->destroyContext(contextId);

    napi_value undefined;
    napi_get_undefined(env, &undefined);
    return undefined;
}

/**
 * invokeDoricMethod(method: string, ...args: string[]): string
 *
 * Aligned with iOS: - (JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args;
 */
static napi_value InvokeDoricMethod(napi_env env, napi_callback_info info) {
    size_t argc = 16; // Support up to 16 arguments (1 method + 15 args)
    napi_value argv[16] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    if (argc < 1 || !g_doricJSEngine) {
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    std::string method = NapiGetString(env, argv[0]);
    std::vector<std::string> args;
    for (size_t i = 1; i < argc; i++) {
        napi_valuetype type;
        napi_typeof(env, argv[i], &type);
        if (type == napi_string) {
            args.push_back(NapiGetString(env, argv[i]));
        } else if (type == napi_number) {
            double num;
            napi_get_value_double(env, argv[i], &num);
            if (num == static_cast<int64_t>(num)) {
                args.push_back(std::to_string(static_cast<int64_t>(num)));
            } else {
                args.push_back(std::to_string(num));
            }
        } else if (type == napi_boolean) {
            bool val;
            napi_get_value_bool(env, argv[i], &val);
            args.push_back(val ? "true" : "false");
        }
    }

    std::string result = g_doricJSEngine->invokeDoricMethod(method, args);

    napi_value napiResult;
    napi_create_string_utf8(env, result.c_str(), result.size(), &napiResult);
    return napiResult;
}

/**
 * setEnvironmentValue(key: string, value: string | number): void
 *
 * Aligned with iOS: - (void)setEnvironmentValue:(NSDictionary *)value;
 */
static napi_value SetEnvironmentValue(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[2] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    if (argc < 2 || !g_doricJSEngine) {
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    std::string key = NapiGetString(env, argv[0]);

    napi_valuetype valueType;
    napi_typeof(env, argv[1], &valueType);

    std::map<std::string, std::variant<double, std::string>> envMap;
    if (valueType == napi_number) {
        double num;
        napi_get_value_double(env, argv[1], &num);
        envMap[key] = num;
    } else {
        std::string strVal = NapiGetString(env, argv[1]);
        envMap[key] = strVal;
    }

    g_doricJSEngine->setEnvironmentValue(envMap);

    napi_value undefined;
    napi_get_undefined(env, &undefined);
    return undefined;
}

/**
 * teardownDoric(): void
 *
 * Aligned with iOS: - (void)teardown;
 */
static napi_value TeardownDoric(napi_env env, napi_callback_info info) {
    if (g_doricJSEngine) {
        g_doricJSEngine->teardown();
        delete g_doricJSEngine;
        g_doricJSEngine = nullptr;
    }

    napi_value undefined;
    napi_get_undefined(env, &undefined);
    return undefined;
}

/**
 * callEntityMethod(contextId: string, method: string, ...args: string[]): string
 *
 * Invoke a method on a Doric context entity (aligned with iOS DoricContext.callEntity).
 * This calls doric.jsCallEntityMethod(contextId, method, ...args) followed by hook.
 */
static napi_value CallEntityMethod(napi_env env, napi_callback_info info) {
    size_t argc = 16;
    napi_value argv[16] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    if (argc < 2 || !g_doricJSEngine) {
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    std::string contextId = NapiGetString(env, argv[0]);
    std::string method = NapiGetString(env, argv[1]);

    // Build args: [contextId, method, ...extraArgs]
    std::vector<std::string> args;
    args.push_back(contextId);
    args.push_back(method);
    for (size_t i = 2; i < argc; i++) {
        napi_valuetype type;
        napi_typeof(env, argv[i], &type);
        if (type == napi_string) {
            args.push_back(NapiGetString(env, argv[i]));
        } else if (type == napi_number) {
            double num;
            napi_get_value_double(env, argv[i], &num);
            if (num == static_cast<int64_t>(num)) {
                args.push_back(std::to_string(static_cast<int64_t>(num)));
            } else {
                args.push_back(std::to_string(num));
            }
        } else if (type == napi_boolean) {
            bool val;
            napi_get_value_bool(env, argv[i], &val);
            args.push_back(val ? "true" : "false");
        }
    }

    std::string result = g_doricJSEngine->invokeDoricMethod("jsCallEntityMethod", args);

    napi_value napiResult;
    napi_create_string_utf8(env, result.c_str(), result.size(), &napiResult);
    return napiResult;
}

/**
 * registerBridgeCallback(callback: (contextId: string, module: string, method: string,
 *                                    callbackId: string, argument: string) => void): void
 *
 * Register the ArkTS callback function that receives bridge calls from JS.
 * This must be called once during initialization, after initDoric().
 *
 * The callback will be invoked on the ArkTS main thread whenever JS calls nativeBridge().
 * The ArkTS side should route the call to DoricBridgeExtension.callNative().
 */
static napi_value RegisterBridgeCallback(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[1] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    if (argc < 1) {
        OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                     "registerBridgeCallback: callback function required");
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    // Verify that the argument is a function
    napi_valuetype valueType;
    napi_typeof(env, argv[0], &valueType);
    if (valueType != napi_function) {
        OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                     "registerBridgeCallback: argument must be a function");
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }

    // Register the callback with DoricBridgeCallback singleton
    DoricBridgeCallback::getInstance().registerCallback(env, argv[0]);

    napi_value undefined;
    napi_get_undefined(env, &undefined);
    return undefined;
}

// ======================================================================
// Module registration
// ======================================================================

EXTERN_C_START
static napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
        {"initDoric", nullptr, InitDoric, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"prepareContext", nullptr, PrepareContext, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"destroyContext", nullptr, DestroyContext, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"invokeDoricMethod", nullptr, InvokeDoricMethod, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"setEnvironmentValue", nullptr, SetEnvironmentValue, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"teardownDoric", nullptr, TeardownDoric, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"callEntityMethod", nullptr, CallEntityMethod, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"registerBridgeCallback", nullptr, RegisterBridgeCallback, nullptr, nullptr, nullptr, napi_default, nullptr},
    };
    napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);
    return exports;
}
EXTERN_C_END

static napi_module doricModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = Init,
    .nm_modname = "doric",
    .nm_priv = ((void *)0),
    .reserved = {0},
};

extern "C" __attribute__((constructor)) void RegisterDoricModule(void) { napi_module_register(&doricModule); }
