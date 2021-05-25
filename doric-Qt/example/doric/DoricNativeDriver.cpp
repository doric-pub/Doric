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
  std::shared_ptr<DoricAsyncResult> asyncResult =
      std::make_shared<DoricAsyncResult>();
  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool, [this, method, args, asyncResult] {
        QString result = this->jsEngine.invokeDoricMethod(method, args);
        asyncResult->setResult(result);
      });

  return asyncResult;
}

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::asyncCall(std::function<void()> lambda,
                             DoricThreadMode mode) {
  switch (mode) {
  case UI:
    return DoricAsyncCall::ensureRunInMain(lambda);
    break;
  case JS:
    return DoricAsyncCall::ensureRunInThreadPool(&jsEngine.mJSThreadPool,
                                                 lambda);
    break;
  }
  return NULL;
}

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::createContext(QString contextId, QString script,
                                 QString source) {
  std::shared_ptr<DoricAsyncResult> asyncResult =
      std::make_shared<DoricAsyncResult>();

  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool, [this, contextId, script, source, asyncResult] {
        QString result =
            this->jsEngine.prepareContext(contextId, script, source);
        asyncResult->setResult(result);
      });

  return asyncResult;
}

std::shared_ptr<DoricAsyncResult>
DoricNativeDriver::destroyContext(QString contextId) {
  std::shared_ptr<DoricAsyncResult> asyncResult =
      std::make_shared<DoricAsyncResult>();

  DoricAsyncCall::ensureRunInThreadPool(
      &jsEngine.mJSThreadPool, [this, contextId, asyncResult] {
        QString result = this->jsEngine.destroyContext(contextId);
        asyncResult->setResult(result);
      });

  return asyncResult;
}

DoricRegistry *DoricNativeDriver::getRegistry() {
  return this->jsEngine.getRegistry();
}
