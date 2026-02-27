#pragma once

#include "../bridge/doric_bridge_callback.h"
#include "../utils/doric_constant.h"
#include "../utils/doric_utils.h"
#include "doric_jse_interface.h"
#include "doric_native_js_executor.h"
#include "single_thread_executor.h"

#include <bundle/native_interface_bundle.h>
#include <deviceinfo.h>
#include <hilog/log.h>
#include <map>
#include <mutex>
#include <regex>
#include <string>
#include <variant>
#include <vector>
#include <window_manager/oh_display_manager.h>

/**
 * DoricJSEngine - JS Engine for Doric on HarmonyOS.
 *
 * Aligned with iOS DoricJSEngine.h interface:
 *   - prepareContext:script:source:
 *   - destroyContext:
 *   - invokeDoricMethod:argumentsArray:
 *   - ensureRunOnJSThread:
 *   - initJSEngine
 *   - teardown
 *   - setEnvironmentValue:
 *
 * Uses JSVM C-API via DoricNativeJSExecutor.
 */
class DoricJSEngine {

public:
    DoricJSEngine() : destroyed_(false), initialized_(false) {
        // Collect environment info (aligned with iOS init)
        collectEnvironment();

        // Initialize on the JS thread
        auto future = jsThread_.submit([this]() {
            this->initJSEngine();
            this->injectGlobal();
            this->initDoricRuntime();
            this->initialized_ = true;
        });
        // Wait for initialization to complete
        future.get();
    }

    ~DoricJSEngine() { teardown(); }

    // ======================================================================
    // Public API - aligned with iOS DoricJSEngine.h
    // ======================================================================

    /**
     * Prepare a Doric context by loading the context script.
     * Aligned with iOS: - (void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;
     */
    void prepareContext(const std::string &contextId, const std::string &script, const std::string &source) {
        ensureRunOnJSThread([this, contextId, script, source]() {
            std::string wrappedScript = packageContextScript(contextId, script);
            std::string sourceTag = "Context://" + (source.empty() ? contextId : source);
            jsExecutor_->loadJS(wrappedScript, sourceTag);
        });
    }

    /**
     * Destroy a Doric context.
     * Aligned with iOS: - (void)destroyContext:(NSString *)contextId;
     */
    void destroyContext(const std::string &contextId) {
        ensureRunOnJSThread([this, contextId]() {
            std::string destroyScript = DoricConstant::TEMPLATE_CONTEXT_DESTROY;
            // Replace %s with contextId
            size_t pos = destroyScript.find("%s");
            if (pos != std::string::npos) {
                destroyScript.replace(pos, 2, contextId);
            }
            jsExecutor_->loadJS(destroyScript, "_Context://" + contextId);
        });
    }

    /**
     * Invoke a method on the global "doric" object with string arguments.
     * Aligned with iOS: - (JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args;
     *
     * Returns the result as a string.
     */
    std::string invokeDoricMethod(const std::string &method, const std::vector<std::string> &args) {
        std::string result;
        ensureRunOnJSThread([this, &method, &args, &result]() {
            result = jsExecutor_->invokeObject(DoricConstant::GLOBAL_DORIC, method, args);
            // After native call, invoke hook (aligned with iOS behavior)
            if (method != DoricConstant::DORIC_CONTEXT_INVOKE_PURE) {
                jsExecutor_->invokeObject(DoricConstant::GLOBAL_DORIC, DoricConstant::DORIC_HOOK_NATIVE_CALL, {});
            }
        });
        return result;
    }

    /**
     * Set environment values and update JS context.
     * Aligned with iOS: - (void)setEnvironmentValue:(NSDictionary *)value;
     */
    void setEnvironmentValue(const std::map<std::string, std::variant<double, std::string>> &value) {
        ensureRunOnJSThread([this, value]() {
            for (const auto &[k, v] : value) {
                environmentMap_[k] = v;
            }
            if (initialized_) {
                jsExecutor_->injectGlobalJSObject(DoricConstant::INJECT_ENVIRONMENT, environmentMap_);
                // Note: In a full implementation, we would notify all alive contexts
                // via onEnvChanged, similar to iOS DoricContextManager
            }
        });
    }

    /**
     * Ensure a block runs on the JS thread.
     * Aligned with iOS: - (void)ensureRunOnJSThread:(dispatch_block_t)block;
     */
    void ensureRunOnJSThread(std::function<void()> block) {
        if (destroyed_) {
            return;
        }
        auto future = jsThread_.submit(std::move(block));
        future.wait();
    }

    /**
     * Post a task to the JS thread without waiting.
     * Useful for fire-and-forget operations like timer callbacks.
     */
    void postToJSThread(std::function<void()> block) {
        if (destroyed_) {
            return;
        }
        jsThread_.submit(std::move(block));
    }

    /**
     * Teardown the JS engine.
     * Aligned with iOS: - (void)teardown;
     */
    void teardown() {
        if (destroyed_) {
            return;
        }
        destroyed_ = true;

        // Clean up timers
        {
            std::lock_guard<std::mutex> lock(timerMutex_);
            timers_.clear();
        }

        jsThread_.submit([this]() {
            if (jsExecutor_) {
                jsExecutor_->teardown();
                delete jsExecutor_;
                jsExecutor_ = nullptr;
            }
        });
        jsThread_.stop();
    }

    /**
     * Get the raw JS executor for advanced operations.
     */
    DoricJSEInterface *getJSExecutor() const { return jsExecutor_; }

    /**
     * Check if the engine has been initialized.
     */
    bool isInitialized() const { return initialized_; }

    /**
     * Check if the engine has been destroyed.
     */
    bool isDestroyed() const { return destroyed_; }

protected:
    /**
     * Initialize the JS engine. Can be overridden for debug/remote executor.
     * Aligned with iOS: - (void)initJSEngine;
     */
    virtual void initJSEngine() { jsExecutor_ = new DoricNativeJSExecutor(); }

private:
    DoricJSEInterface *jsExecutor_ = nullptr;
    SingleThreadExecutor jsThread_;
    std::map<std::string, std::variant<double, std::string>> environmentMap_;
    bool destroyed_;
    bool initialized_;

    // Timer management
    struct TimerInfo {
        int64_t timerId;
        double interval;
        bool repeat;
    };
    std::map<int64_t, TimerInfo> timers_;
    std::mutex timerMutex_;

    // ======================================================================
    // Native callbacks injected into JSVM (aligned with iOS initJSExecutor)
    // ======================================================================

    /**
     * nativeLog(type, message) - JS -> Native log callback.
     */
    static JSVM_Value NativeLog(JSVM_Env env, JSVM_CallbackInfo info) {
        size_t argc = 2;
        JSVM_Value args[2] = {nullptr};
        OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, nullptr);

        std::string type = DoricUtils::GetValueString(env, args[0]);
        std::string message = DoricUtils::GetValueString(env, args[1]);

        if (type == "e") {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric", "JS-E: %{public}s", message.c_str());
        } else if (type == "w") {
            OH_LOG_Print(LOG_APP, LOG_WARN, 0x8000, "Doric", "JS-W: %{public}s", message.c_str());
        } else {
            OH_LOG_Print(LOG_APP, LOG_DEBUG, 0x8000, "Doric", "JS-D: %{public}s", message.c_str());
        }

        JSVM_Value undefined = nullptr;
        OH_JSVM_GetUndefined(env, &undefined);
        return undefined;
    }

    /**
     * nativeRequire(name) - JS -> Native module require callback.
     */
    static JSVM_Value NativeRequire(JSVM_Env env, JSVM_CallbackInfo info) {
        size_t argc = 1;
        JSVM_Value args[1] = {nullptr};
        void *data = nullptr;
        OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, &data);

        std::string name = DoricUtils::GetValueString(env, args[0]);
        OH_LOG_Print(LOG_APP, LOG_INFO, 0x8000, "Doric", "NativeRequire: %{public}s", name.c_str());

        auto *engine = static_cast<DoricJSEngine *>(data);
        JSVM_Value result = nullptr;

        if (engine && engine->jsExecutor_) {
            // Try to load the required JS bundle from rawfile
            std::string content = DoricUtils::ReadRawFile(name);
            if (!content.empty()) {
                std::string moduleScript = engine->packageModuleScript(name, content);
                engine->jsExecutor_->loadJS(moduleScript, "Module://" + name);
                OH_JSVM_GetBoolean(env, true, &result);
            } else {
                OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                             "NativeRequire: bundle '%{public}s' is empty", name.c_str());
                OH_JSVM_GetBoolean(env, false, &result);
            }
        } else {
            OH_JSVM_GetBoolean(env, false, &result);
        }

        return result;
    }

    /**
     * nativeBridge(contextId, module, method, callbackId, argument) - JS -> Native bridge callback.
     *
     * Serializes the JS argument to JSON string and dispatches to ArkTS side via
     * DoricBridgeCallback (napi_threadsafe_function).
     *
     * Aligned with iOS DoricJSEngine NativeBridge → DoricBridgeExtension.callNativeWithContextId
     */
    static JSVM_Value NativeBridge(JSVM_Env env, JSVM_CallbackInfo info) {
        size_t argc = 5;
        JSVM_Value args[5] = {nullptr};
        OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, nullptr);

        std::string contextId = DoricUtils::GetValueString(env, args[0]);
        std::string module = DoricUtils::GetValueString(env, args[1]);
        std::string method = DoricUtils::GetValueString(env, args[2]);
        std::string callbackId = DoricUtils::GetValueString(env, args[3]);

        // Serialize args[4] (the JS argument object) to JSON string
        // This is analogous to iOS passing NSDictionary / Android passing JSObject
        std::string argument;
        if (argc > 4 && args[4] != nullptr) {
            JSVM_ValueType argType;
            OH_JSVM_Typeof(env, args[4], &argType);

            if (argType == JSVM_STRING) {
                argument = DoricUtils::GetValueString(env, args[4]);
            } else if (argType == JSVM_OBJECT) {
                // Use JSON.stringify to serialize the object
                JSVM_Value global = nullptr;
                OH_JSVM_GetGlobal(env, &global);
                JSVM_Value jsonKey = nullptr;
                OH_JSVM_CreateStringUtf8(env, "JSON", JSVM_AUTO_LENGTH, &jsonKey);
                JSVM_Value jsonObj = nullptr;
                OH_JSVM_GetProperty(env, global, jsonKey, &jsonObj);
                JSVM_Value stringifyKey = nullptr;
                OH_JSVM_CreateStringUtf8(env, "stringify", JSVM_AUTO_LENGTH, &stringifyKey);
                JSVM_Value stringifyFunc = nullptr;
                OH_JSVM_GetProperty(env, jsonObj, stringifyKey, &stringifyFunc);

                JSVM_Value result = nullptr;
                JSVM_Value stringifyArgs[] = {args[4]};
                JSVM_Status callStatus = OH_JSVM_CallFunction(env, jsonObj, stringifyFunc, 1, stringifyArgs, &result);
                if (callStatus == JSVM_OK && result != nullptr) {
                    argument = DoricUtils::GetValueString(env, result);
                }
            } else if (argType == JSVM_NUMBER) {
                double num;
                OH_JSVM_GetValueDouble(env, args[4], &num);
                if (num == static_cast<int64_t>(num)) {
                    argument = std::to_string(static_cast<int64_t>(num));
                } else {
                    argument = std::to_string(num);
                }
            } else if (argType == JSVM_BOOLEAN) {
                bool val;
                OH_JSVM_GetValueBool(env, args[4], &val);
                argument = val ? "true" : "false";
            }
        }

        OH_LOG_Print(LOG_APP, LOG_DEBUG, 0x8000, "Doric",
                     "NativeBridge: ctx=%{public}s mod=%{public}s method=%{public}s cb=%{public}s",
                     contextId.c_str(), module.c_str(), method.c_str(), callbackId.c_str());

        // Dispatch to ArkTS side via threadsafe function
        DoricBridgeCallback::getInstance().dispatch(contextId, module, method, callbackId, argument);

        JSVM_Value undefined = nullptr;
        OH_JSVM_GetUndefined(env, &undefined);
        return undefined;
    }

    /**
     * nativeSetTimer(timerId, interval, isInterval) - JS -> Native timer set callback.
     */
    static JSVM_Value NativeSetTimer(JSVM_Env env, JSVM_CallbackInfo info) {
        size_t argc = 3;
        JSVM_Value args[3] = {nullptr};
        void *data = nullptr;
        OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, &data);

        double timerId = 0;
        OH_JSVM_GetValueDouble(env, args[0], &timerId);
        double interval = 0;
        OH_JSVM_GetValueDouble(env, args[1], &interval);
        bool isInterval = false;
        OH_JSVM_GetValueBool(env, args[2], &isInterval);

        auto *engine = static_cast<DoricJSEngine *>(data);
        if (engine) {
            int64_t id = static_cast<int64_t>(timerId);
            {
                std::lock_guard<std::mutex> lock(engine->timerMutex_);
                engine->timers_[id] = {id, interval, isInterval};
            }

            // Schedule timer on a separate thread
            std::thread([engine, id, interval, isInterval]() {
                std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int64_t>(interval)));
                if (engine->isDestroyed()) {
                    return;
                }
                engine->postToJSThread([engine, id, isInterval]() {
                    std::string timerIdStr = std::to_string(id);
                    engine->jsExecutor_->invokeObject(
                        DoricConstant::GLOBAL_DORIC, DoricConstant::DORIC_TIMER_CALLBACK,
                        {timerIdStr});

                    if (!isInterval) {
                        std::lock_guard<std::mutex> lock(engine->timerMutex_);
                        engine->timers_.erase(id);
                    }
                });

                // For repeating timers, keep scheduling
                if (isInterval) {
                    while (!engine->isDestroyed()) {
                        {
                            std::lock_guard<std::mutex> lock(engine->timerMutex_);
                            if (engine->timers_.find(id) == engine->timers_.end()) {
                                break; // Timer was cleared
                            }
                        }
                        std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int64_t>(interval)));
                        if (engine->isDestroyed()) {
                            break;
                        }
                        {
                            std::lock_guard<std::mutex> lock(engine->timerMutex_);
                            if (engine->timers_.find(id) == engine->timers_.end()) {
                                break;
                            }
                        }
                        engine->postToJSThread([engine, id]() {
                            std::string timerIdStr = std::to_string(id);
                            engine->jsExecutor_->invokeObject(
                                DoricConstant::GLOBAL_DORIC, DoricConstant::DORIC_TIMER_CALLBACK,
                                {timerIdStr});
                        });
                    }
                }
            }).detach();
        }

        JSVM_Value undefined = nullptr;
        OH_JSVM_GetUndefined(env, &undefined);
        return undefined;
    }

    /**
     * nativeClearTimer(timerId) - JS -> Native timer clear callback.
     */
    static JSVM_Value NativeClearTimer(JSVM_Env env, JSVM_CallbackInfo info) {
        size_t argc = 1;
        JSVM_Value args[1] = {nullptr};
        void *data = nullptr;
        OH_JSVM_GetCbInfo(env, info, &argc, args, nullptr, &data);

        double timerId = 0;
        OH_JSVM_GetValueDouble(env, args[0], &timerId);

        auto *engine = static_cast<DoricJSEngine *>(data);
        if (engine) {
            int64_t id = static_cast<int64_t>(timerId);
            std::lock_guard<std::mutex> lock(engine->timerMutex_);
            engine->timers_.erase(id);
        }

        JSVM_Value undefined = nullptr;
        OH_JSVM_GetUndefined(env, &undefined);
        return undefined;
    }

    // ======================================================================
    // Initialization methods (aligned with iOS initJSExecutor / initDoricEnvironment)
    // ======================================================================

    void collectEnvironment() {
        environmentMap_["platform"] = std::string("HarmonyOS Next");
        environmentMap_["platformVersion"] = std::string(OH_GetOSFullName());

        OH_NativeBundle_ApplicationInfo appInfo = OH_NativeBundle_GetCurrentApplicationInfo();
        environmentMap_["appName"] = std::string(appInfo.bundleName);

        int screenWidth = 0;
        OH_NativeDisplayManager_GetDefaultDisplayWidth(&screenWidth);
        environmentMap_["screenWidth"] = static_cast<double>(screenWidth);

        int screenHeight = 0;
        OH_NativeDisplayManager_GetDefaultDisplayHeight(&screenHeight);
        environmentMap_["screenHeight"] = static_cast<double>(screenHeight);

        float screenScale = 0;
        OH_NativeDisplayManager_GetDefaultDisplayDensityPixels(&screenScale);
        environmentMap_["screenScale"] = static_cast<double>(screenScale);

        environmentMap_["deviceBrand"] = std::string(OH_GetBrand());
        environmentMap_["deviceModel"] = std::string(OH_GetProductModel());
    }

    /**
     * Inject native global functions and environment into JSVM.
     * Aligned with iOS initJSExecutor.
     */
    void injectGlobal() {
        // Inject environment object
        jsExecutor_->injectGlobalJSObject(DoricConstant::INJECT_ENVIRONMENT, environmentMap_);

        // Inject native log function
        jsExecutor_->injectGlobalJSFunction(DoricConstant::INJECT_LOG, NativeLog, nullptr);

        // Inject native require function (pass `this` as data for callback)
        jsExecutor_->injectGlobalJSFunction(DoricConstant::INJECT_REQUIRE, NativeRequire, this);

        // Inject native bridge function
        jsExecutor_->injectGlobalJSFunction(DoricConstant::INJECT_BRIDGE, NativeBridge, this);

        // Inject timer functions
        jsExecutor_->injectGlobalJSFunction(DoricConstant::INJECT_TIMER_SET, NativeSetTimer, this);
        jsExecutor_->injectGlobalJSFunction(DoricConstant::INJECT_TIMER_CLEAR, NativeClearTimer, this);
    }

    /**
     * Load the Doric sandbox and library scripts.
     * Aligned with iOS initDoricEnvironment.
     */
    void initDoricRuntime() {
        loadBuiltinJS(DoricConstant::DORIC_BUNDLE_SANDBOX);

        std::string libName = DoricConstant::DORIC_BUNDLE_LIB;
        std::string libJS = DoricUtils::ReadRawFile(libName);
        if (!libJS.empty()) {
            jsExecutor_->loadJS(packageModuleScript(DoricConstant::DORIC_MODULE_LIB, libJS), "Module://" + libName);
        } else {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "Failed to load doric lib JS bundle: %{public}s", libName.c_str());
        }
    }

    void loadBuiltinJS(const std::string &rawFileName) {
        std::string fileContent = DoricUtils::ReadRawFile(rawFileName);
        if (!fileContent.empty()) {
            jsExecutor_->loadJS(fileContent, "Assets://" + rawFileName);
        } else {
            OH_LOG_Print(LOG_APP, LOG_ERROR, 0x8000, "Doric",
                         "Failed to load builtin JS: %{public}s", rawFileName.c_str());
        }
    }

    // ======================================================================
    // Script packaging utilities (aligned with iOS)
    // ======================================================================

    /**
     * Package a context creation script.
     * Aligned with iOS: - (NSString *)packageContextScript:(NSString *)contextId content:(NSString *)content;
     */
    std::string packageContextScript(const std::string &contextId, const std::string &content) {
        std::string tmpl = DoricConstant::TEMPLATE_CONTEXT_CREATE;
        // Replace %s1 with content, %s2 and %s3 with contextId
        std::string result = std::regex_replace(tmpl, std::regex("%s1"), content);
        result = std::regex_replace(result, std::regex("%s2"), contextId);
        result = std::regex_replace(result, std::regex("%s3"), contextId);
        return result;
    }

    /**
     * Package a module registration script.
     * Aligned with iOS: - (NSString *)packageModuleScript:(NSString *)moduleName content:(NSString *)content;
     */
    std::string packageModuleScript(const std::string &moduleName, const std::string &content) {
        std::string tmpl = DoricConstant::TEMPLATE_MODULE;
        std::string result = std::regex_replace(tmpl, std::regex("%s1"), moduleName);
        result = std::regex_replace(result, std::regex("%s2"), content);
        return result;
    }
};
