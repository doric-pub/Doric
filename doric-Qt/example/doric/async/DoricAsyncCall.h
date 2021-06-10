#ifndef ASYNC_CALL_H
#define ASYNC_CALL_H

#include <QFuture>
#include <QThreadPool>
#include <QtConcurrent/QtConcurrent>

#include "DoricExport.h"

#include "DoricAsyncResult.h"

class DORIC_EXPORT DoricAsyncCall {

public:
  template <typename Function>
  static std::shared_ptr<DoricAsyncResult>
  ensureRunInThreadPool(QThreadPool *threadPool, Function &&function) {
    std::shared_ptr<DoricAsyncResult> asyncResult =
        std::make_shared<DoricAsyncResult>();

    Function lambda = std::forward<Function>(function);

    QtConcurrent::run(threadPool, [lambda, asyncResult]() {
      lambda();
      //      asyncResult->setResult(result);
    });

    return asyncResult;
  }

  template <typename Function>
  static std::shared_ptr<DoricAsyncResult>
  ensureRunInMain(Function &&function, QThread *thread = qApp->thread()) {
    std::shared_ptr<DoricAsyncResult> asyncResult =
        std::make_shared<DoricAsyncResult>();

    auto *obj = QAbstractEventDispatcher::instance(thread);
    Q_ASSERT(obj);

    Function lambda = std::forward<Function>(function);
    QMetaObject::invokeMethod(obj, [lambda, asyncResult]() {
      lambda();
      //        asyncResult->setResult(result);
    });

    return asyncResult;
  }
};

#endif // ASYNC_CALL_H
