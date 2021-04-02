#include <functional>

#include "DoricNativeDriver.h"
#include "async/DoricAsyncCall.h"
#include "utils/DoricConstant.h"

void DoricNativeDriver::invokeContextEntityMethod(QString contextId,
                                                  QString method,
                                                  QVariantList args) {
  args.insert(0, QVariant(contextId));
  args.insert(1, QVariant(method));
  invokeDoricMethod(DoricConstant::DORIC_CONTEXT_INVOKE, args);
}

void DoricNativeDriver::invokeDoricMethod(QString method, QVariantList args) {
  return DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool, [this, method, args] {
        this->jsEngine.invokeDoricMethod(method, args);
      });
}

DoricAsyncResult *DoricNativeDriver::asyncCall(std::function<void()> lambda,
                                               DoricThreadMode mode) {
  switch (mode) {
  case UI:
    DoricAsyncCall::ensureRunInMain(lambda);
    break;
  case JS:
    DoricAsyncCall::ensureRunInThreadPool(&jsEngine.mJSThreadPool, lambda);
    break;
  }
  return NULL;
}

void DoricNativeDriver::createContext(QString contextId, QString script,
                                      QString source) {
  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool, [this, contextId, script, source] {
        this->jsEngine.prepareContext(contextId, script, source);
      });
}

void DoricNativeDriver::destroyContext(QString contextId) {}

DoricRegistry *DoricNativeDriver::getRegistry() {
  return this->jsEngine.getRegistry();
}
