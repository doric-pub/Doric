#include "engine/doric_js_engine.h"
#include "napi/native_api.h"
#include "utils/doric_utils.h"

static napi_value InitDoric(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[1] = {nullptr};
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);
    DoricUtils::GlobalNativeResourceManager = OH_ResourceManager_InitNativeResourceManager(env, argv[0]);

    DoricJSEngine *doricJSEngine = new DoricJSEngine();

    napi_value sum;
    napi_create_double(env, 0, &sum);

    return sum;
}

EXTERN_C_START
static napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
        {"initDoric", nullptr, InitDoric, nullptr, nullptr, nullptr, napi_default, nullptr}};
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
