#include <functional>

#include "DoricNativeDriver.h"
#include "async/DoricAsyncCall.h"
#include "utils/DoricConstant.h"

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::invokeContextEntityMethod(QString contextId, QString method,
                                             QVariantList args) {
  args.insert(0, QVariant(contextId));
  args.insert(1, QVariant(method));
  return invokeDoricMethod(DoricConstant::DORIC_CONTEXT_INVOKE, args);
}

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::invokeDoricMethod(QString method, QVariantList args) {
  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool,
      [this, method, args] { this->jsEngine.invokeDoricMethod(method, args); });

  return std::make_shared<DoricAsyncResult>();
}

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::asyncCall(std::function<void()> lambda,
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

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::createContext(QString contextId, QString script,
                                 QString source) {
  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool, [this, contextId, script, source] {
        this->jsEngine.prepareContext(contextId, script, source);
      });

  return std::make_shared<DoricAsyncResult>();
}

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::destroyContext(QString contextId) {
  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool,
      [this, contextId] { this->jsEngine.destroyContext(contextId); });

  return std::make_shared<DoricAsyncResult>();
}

DoricRegistry *DoricNativeDriver::getRegistry() {
  return this->jsEngine.getRegistry();
}
