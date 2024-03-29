#include <QGuiApplication>
#include <QJsonObject>
#include <QRect>
#include <QScreen>
#include <QSysInfo>
#include <QtConcurrent/QtConcurrent>

#include "../utils/DoricConstant.h"
#include "../utils/DoricUtils.h"
#include "DoricBridgeExtension.h"
#include "DoricJSEngine.h"
#include "DoricNativeEmpty.h"
#include "DoricNativeJSE.h"
#include "DoricNativeLog.h"
#include "DoricNativeRequire.h"
#include "DoricTimerExtension.h"

DoricJSEngine::DoricJSEngine(QObject *parent) : QObject(parent) {
  mJSThreadPool.setMaxThreadCount(1);
  mJSThreadPool.setExpiryTimeout(-1);

  {
    auto result = QtConcurrent::run(
        &mJSThreadPool, [this] { mJSE = new DoricNativeJSE(JSEType::V8); });
  }
  {
    auto result = QtConcurrent::run(&mJSThreadPool, [this] {
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

      mJSE->injectGlobalJSObject(DoricConstant::INJECT_ENVIRONMENT, envObject);

      // inject log
      DoricNativeLog *nativeLog = new DoricNativeLog();
      mJSE->injectGlobalJSFunction(DoricConstant::INJECT_LOG, nativeLog,
                                   "function");

      // inject require
      DoricNativeRequire *nativeRequire = new DoricNativeRequire();
      mJSE->injectGlobalJSFunction(DoricConstant::INJECT_REQUIRE, nativeRequire,
                                   "function");

      // inject timer set & clear
      DoricTimerExtension *timerExtension =
          new DoricTimerExtension([this](long timerId) {
            auto result = QtConcurrent::run(&mJSThreadPool, [this, timerId] {
              QVariantList arguments;
              arguments.push_back(QVariant((int)timerId));
              this->invokeDoricMethod(DoricConstant::DORIC_TIMER_CALLBACK,
                                      arguments);
            });
          });
      mJSE->injectGlobalJSFunction(DoricConstant::INJECT_TIMER_SET,
                                   timerExtension, "setTimer");
      mJSE->injectGlobalJSFunction(DoricConstant::INJECT_TIMER_CLEAR,
                                   timerExtension, "clearTimer");

      DoricBridgeExtension *bridgeExtension = new DoricBridgeExtension();
      mJSE->injectGlobalJSFunction(DoricConstant::INJECT_BRIDGE,
                                   bridgeExtension, "callNative");
    });
  }

  {
    auto result = QtConcurrent::run(&mJSThreadPool, [this] {
      loadBuiltinJS(DoricConstant::DORIC_BUNDLE_SANDBOX);

      QString libName = DoricConstant::DORIC_MODULE_LIB;
      QString libJS =
          DoricUtils::readAssetFile("/doric", DoricConstant::DORIC_BUNDLE_LIB);
      QString script = packageModuleScript(libName, libJS);

      mJSE->loadJS(script, "Module://" + libName);
    });
  }
}

QString DoricJSEngine::prepareContext(QString contextId, QString script,
                                      QString source) {
  return mJSE->loadJS(packageContextScript(contextId, script),
                      "Context://" + source);
}

QString DoricJSEngine::destroyContext(QString contextId) {
  QString script =
      QString(DoricConstant::TEMPLATE_CONTEXT_DESTROY).replace("%s", contextId);
  return mJSE->loadJS(script, "_Context://" + contextId);
}

QString DoricJSEngine::invokeDoricMethod(QString method,
                                         QVariantList arguments) {
  QString ret = mJSE->invokeObject(DoricConstant::GLOBAL_DORIC, method, arguments);

  if (method != DoricConstant::DORIC_CONTEXT_INVOKE_PURE) {
      QVariantList newArguments;
      newArguments.append(0);
      newArguments.append(false);
      mJSE->invokeObject(DoricConstant::GLOBAL_DORIC, DoricConstant::DORIC_HOOK_NATIVE_CALL, newArguments);
  }
  return ret;
}

void DoricJSEngine::loadBuiltinJS(QString assetName) {
  QString script = DoricUtils::readAssetFile("/doric", assetName);
  QString result = mJSE->loadJS(script, "Assets://" + assetName);
  qDebug() << result;
}

QString DoricJSEngine::packageContextScript(QString contextId,
                                            QString content) {
  return QString(DoricConstant::TEMPLATE_CONTEXT_CREATE)
      .replace("%s1", content)
      .replace("%s2", contextId)
      .replace("%s3", contextId);
}

QString DoricJSEngine::packageModuleScript(QString moduleName,
                                           QString content) {
  return QString(DoricConstant::TEMPLATE_MODULE)
      .replace("%s1", moduleName)
      .replace("%s2", content);
}

DoricRegistry *DoricJSEngine::getRegistry() { return this->mRegistry; }

DoricJSEngine::~DoricJSEngine() {}
