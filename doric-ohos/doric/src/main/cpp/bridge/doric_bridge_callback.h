#pragma once

#include "napi/native_api.h"
#include <hilog/log.h>
#include <mutex>
#include <string>

/**
 * DoricBridgeCallback - Manages the thread-safe callback from C++ JSVM thread to ArkTS main thread.
 *
 * When nativeBridge() is called from JS (on the JSVM thread), we need to dispatch the call
 * to the ArkTS side (main thread) where DoricBridgeExtension can route it to the correct plugin.
 *
 * This is achieved using napi_threadsafe_function:
 *   1. ArkTS registers a callback via registerBridgeCallback()
 *   2. NativeBridge serializes the call data and dispatches via napi_call_threadsafe_function
 *   3. The callback is invoked on the ArkTS main thread
 *   4. DoricBridgeExtension.callNative() processes the bridge call
 */

/**
 * Data structure passed from JSVM thread to ArkTS main thread.
 */
struct BridgeCallData {
    std::string contextId;
    std::string module;
    std::string method;
    std::string callbackId;
    std::string argument; // JSON-serialized argument
};

class DoricBridgeCallback {
public:
    static DoricBridgeCallback &getInstance() {
        static DoricBridgeCallback instance;
        return instance;
    }

    /**
     * Register the threadsafe function from ArkTS side.
     * Called by registerBridgeCallback() NAPI function.
     */
    void registerCallback(napi_env env, napi_value callback) {
        std::lock_guard<std::mutex> lock(mutex_);

        // Clean up existing if any
        if (tsfn_ != nullptr) {
            napi_release_threadsafe_function(tsfn_, napi_tsfn_release);
            tsfn_ = nullptr;
        }

        napi_value resourceName;
        napi_create_string_utf8(env, "DoricBridgeCallback", NAPI_AUTO_LENGTH, &resourceName);

        napi_status status = napi_create_threadsafe_function(
            env,
            callback,
            nullptr,        // async_resource
            resourceName,   // async_resource_name
            0,              // max_queue_size (0 = unlimited)
            1,              // initial_thread_count
            nullptr,        // thread_finalize_data
            nullptr,        // thread_finalize_cb
            nullptr,        // context
            CallJS,         // call_js_cb
            &tsfn_);

        if (status != napi_ok) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "Failed to create threadsafe function: %{public}d", static_cast<int>(status));
            tsfn_ = nullptr;
        } else {
            OH_LOG_Print(LOG_APP, LOG_INFO, 0x8000, "Doric", "Bridge callback registered successfully");
        }
    }

    /**
     * Dispatch a bridge call from the JSVM thread to the ArkTS main thread.
     * This is called by NativeBridge() in doric_js_engine.h.
     */
    void dispatch(const std::string &contextId, const std::string &module,
                  const std::string &method, const std::string &callbackId,
                  const std::string &argument) {
        std::lock_guard<std::mutex> lock(mutex_);

        if (tsfn_ == nullptr) {
            OH_LOG_Print(LOG_APP, LOG_WARN, 0x8000, "Doric",
                         "Bridge callback not registered, bridge call dropped");
            return;
        }

        // Create data on heap - will be freed in CallJS callback
        auto *data = new BridgeCallData();
        data->contextId = contextId;
        data->module = module;
        data->method = method;
        data->callbackId = callbackId;
        data->argument = argument;

        napi_status status = napi_call_threadsafe_function(tsfn_, data, napi_tsfn_nonblocking);
        if (status != napi_ok) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "Failed to call threadsafe function: %{public}d", static_cast<int>(status));
            delete data;
        }
    }

    /**
     * Unregister and release the threadsafe function.
     */
    void unregister() {
        std::lock_guard<std::mutex> lock(mutex_);
        if (tsfn_ != nullptr) {
            napi_release_threadsafe_function(tsfn_, napi_tsfn_release);
            tsfn_ = nullptr;
        }
    }

private:
    DoricBridgeCallback() = default;
    ~DoricBridgeCallback() { unregister(); }

    // Prevent copies
    DoricBridgeCallback(const DoricBridgeCallback &) = delete;
    DoricBridgeCallback &operator=(const DoricBridgeCallback &) = delete;

    napi_threadsafe_function tsfn_ = nullptr;
    std::mutex mutex_;

    /**
     * Callback invoked on the ArkTS main thread.
     * Converts the BridgeCallData into NAPI values and calls the ArkTS callback function.
     *
     * The ArkTS callback signature:
     *   (contextId: string, module: string, method: string, callbackId: string, argument: string) => void
     */
    static void CallJS(napi_env env, napi_value jsCb, void * /*context*/, void *data) {
        if (data == nullptr) {
            return;
        }

        auto *callData = static_cast<BridgeCallData *>(data);

        // Create NAPI string values for each parameter
        napi_value argv[5];
        napi_create_string_utf8(env, callData->contextId.c_str(), callData->contextId.size(), &argv[0]);
        napi_create_string_utf8(env, callData->module.c_str(), callData->module.size(), &argv[1]);
        napi_create_string_utf8(env, callData->method.c_str(), callData->method.size(), &argv[2]);
        napi_create_string_utf8(env, callData->callbackId.c_str(), callData->callbackId.size(), &argv[3]);
        napi_create_string_utf8(env, callData->argument.c_str(), callData->argument.size(), &argv[4]);

        // Call the ArkTS callback
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        napi_status status = napi_call_function(env, undefined, jsCb, 5, argv, nullptr);
        if (status != napi_ok) {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "Failed to call bridge JS callback: %{public}d", static_cast<int>(status));
        }

        // Clean up
        delete callData;
    }
};
