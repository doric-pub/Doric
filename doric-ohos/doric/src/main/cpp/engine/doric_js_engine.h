#include "../utils/doric_constant.h"
#include "deviceinfo.h"
#include "doric_jse_interface.h"
#include "doric_native_js_executor.h"
#include "single_thread_executor.h"
#include <bundle/native_interface_bundle.h>
#include <regex>
#include <window_manager/oh_display_manager.h>

class DoricJSEngine {
protected:
    DoricJSEInterface *mDoricJSE;

private:
    SingleThreadExecutor mJSThread;

public:
    DoricJSEngine() {
        auto future = mJSThread.submit([this]() {
            this->initJSEngine();
            this->injectGlobal();
            this->initDoricRuntime();
        });
    }

protected:
    void initJSEngine() { mDoricJSE = new DoricNativeJSExecutor(); }

private:
    std::map<std::string, std::variant<double, std::string>> mEnvironmentMap;
    void injectGlobal() {
        mEnvironmentMap["platform"] = "HarmonyOS Next";
        mEnvironmentMap["platformVersion"] = OH_GetOSFullName();
        OH_NativeBundle_ApplicationInfo applicationInfo = OH_NativeBundle_GetCurrentApplicationInfo();
        mEnvironmentMap["appName"] = applicationInfo.bundleName;
        int screenWidth = 0;
        OH_NativeDisplayManager_GetDefaultDisplayWidth(&screenWidth);
        mEnvironmentMap["screenWidth"] = (double)screenWidth;
        int screenHeight = 0;
        OH_NativeDisplayManager_GetDefaultDisplayHeight(&screenHeight);
        mEnvironmentMap["screenHeight"] = (double)screenHeight;
        float screenScale = 0;
        OH_NativeDisplayManager_GetDefaultDisplayDensityPixels(&screenScale);
        mEnvironmentMap["screenScale"] = (double)screenScale;
        mEnvironmentMap["deviceBrand"] = OH_GetBrand();
        mEnvironmentMap["deviceModel"] = OH_GetProductModel();

        mDoricJSE->injectGlobalJSObject(DoricConstant::INJECT_ENVIRONMENT, mEnvironmentMap);
    }

    void initDoricRuntime() {
        loadBuiltinJS(DoricConstant::DORIC_BUNDLE_SANDBOX);
        std::string libName = DoricConstant::DORIC_BUNDLE_LIB;
        std::string libJS = DoricUtils::ReadRawFile(libName);
        mDoricJSE->loadJS(packageModuleScript(libName, libJS), "Module://" + libName);
    }

    void loadBuiltinJS(std::string rawFileName) {
        std::string fileContent = DoricUtils::ReadRawFile(rawFileName);
        mDoricJSE->loadJS(fileContent, "Assets://" + rawFileName);
    }

    std::string packageModuleScript(std::string moduleName, std::string content) {
        std::regex regex1("%s1");
        std::string result1 = std::regex_replace(DoricConstant::TEMPLATE_MODULE, regex1, moduleName);
        std::regex regex2("%s2");
        std::string result2 = std::regex_replace(result1, regex2, content);

        return result2;
    }
};