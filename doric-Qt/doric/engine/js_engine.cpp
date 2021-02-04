#include <QGuiApplication>
#include <QJsonObject>
#include <QRect>
#include <QScreen>
#include <QSysInfo>
#include <QtConcurrent/QtConcurrent>

#include "js_engine.h"
#include "native_jse.h"
#include "../utils/constant.h"
#include "native_log.h"
#include "native_empty.h"
#include "native_require.h"
#include "timer_extension.h"
#include "bridge_extension.h"
#include "../utils/utils.h"

JSEngine::JSEngine(QObject *parent) : QObject(parent)
{
    mJSThreadPool.setMaxThreadCount(1);

    QtConcurrent::run(&mJSThreadPool, [this]{
        mJSE = new NativeJSE();
    });
    QtConcurrent::run(&mJSThreadPool, [this]{
        // inject env
        QScreen *screen = QGuiApplication::primaryScreen();
        QRect screenGeometry = screen->geometry();
        int screenWidth = screenGeometry.width();
        int screenHeight = screenGeometry.height();

        QObject *envObject = new QObject();
        envObject->setProperty("platform", "Qt");
        envObject->setProperty("platformVersion", qVersion());
        envObject->setProperty("appName", "appName");
        envObject->setProperty("appVersion", "appVersion");
        envObject->setProperty("screenWidth", screenWidth);
        envObject->setProperty("screenHeight", screenHeight);
        envObject->setProperty("screenScale", 1);
        envObject->setProperty("statusBarHeight", 0);
        envObject->setProperty("hasNotch", false);
        envObject->setProperty("deviceBrand", QSysInfo::prettyProductName());
        envObject->setProperty("deviceModel", QSysInfo::productType());

        mJSE->injectGlobalJSObject(Constant::INJECT_ENVIRONMENT, envObject);

        // inject log
        NativeLog *nativeLog = new NativeLog();
        mJSE->injectGlobalJSFunction(Constant::INJECT_LOG, nativeLog, "function");

        // inject empty
        NativeEmpty *nativeEmpty = new NativeEmpty();
        mJSE->injectGlobalJSFunction(Constant::INJECT_EMPTY, nativeEmpty, "function");

        // inject require
        NativeRequire *nativeRequire = new NativeRequire();
        mJSE->injectGlobalJSFunction(Constant::INJECT_REQUIRE, nativeRequire, "function");

        // inject timer set & clear
        TimerExtension *timerExtension = new TimerExtension([this](long timerId){
            QVariantList arguments;
            arguments.push_back(QVariant((int)timerId));
            this->invokeDoricMethod(Constant::DORIC_TIMER_CALLBACK, arguments);
        });
        mJSE->injectGlobalJSFunction(Constant::INJECT_TIMER_SET, timerExtension, "setTimer");
        mJSE->injectGlobalJSFunction(Constant::INJECT_TIMER_CLEAR, timerExtension, "clearTimer");

        BridgeExtension *bridgeExtension = new BridgeExtension();
        mJSE->injectGlobalJSFunction(Constant::INJECT_BRIDGE, bridgeExtension, "callNative");
    });
    QtConcurrent::run(&mJSThreadPool, [this]{
        loadBuiltinJS(Constant::DORIC_BUNDLE_SANDBOX);

        QString libName = Constant::DORIC_MODULE_LIB;
        QString libJS = Utils::readAssetFile("/doric", Constant::DORIC_BUNDLE_LIB);
        QString script = packageModuleScript(libName, libJS);

        mJSE->loadJS(script, "Module://" + libName);
    });
}

void JSEngine::prepareContext(QString contextId, QString script, QString source)
{
    mJSE->loadJS(packageContextScript(contextId, script), "Context://" + source);
}

QJSValue JSEngine::invokeDoricMethod(QString method, QVariantList arguments)
{
    return mJSE->invokeObject(Constant::GLOBAL_DORIC, method, arguments);
}

void JSEngine::loadBuiltinJS(QString assetName)
{
    QString script = Utils::readAssetFile("/doric", assetName);
    QString result = mJSE->loadJS(script, "Assets://" + assetName);
}

QString JSEngine::packageContextScript(QString contextId, QString content)
{
    return QString(Constant::TEMPLATE_CONTEXT_CREATE).replace("%s1", content).replace("%s2", contextId).replace("%s3", contextId);
}

QString JSEngine::packageModuleScript(QString moduleName, QString content)
{
    return QString(Constant::TEMPLATE_MODULE).replace("%s1", moduleName).replace("%s2", content);
}

Registry *JSEngine::getRegistry()
{
    return this->mRegistry;
}

JSEngine::~JSEngine()
{

}
