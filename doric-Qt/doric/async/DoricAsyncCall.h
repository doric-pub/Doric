#ifndef ASYNC_CALL_H
#define ASYNC_CALL_H

#include <QFuture>
#include <QThreadPool>
#include <QtConcurrent/QtConcurrent>

class DoricAsyncCall {

public:
  static void ensureRunInThreadPool(QThreadPool *threadPool,
                                    std::function<void()> lambda) {
    QFuture<std::function<void()>::result_type> future =
        QtConcurrent::run(threadPool, lambda);
  }

  template <typename Function>
  static void ensureRunInMain(Function &&function,
                              QThread *thread = qApp->thread()) {
    auto *obj = QAbstractEventDispatcher::instance(thread);
    Q_ASSERT(obj);
    QMetaObject::invokeMethod(obj, std::forward<Function>(function));
  }
};

#endif // ASYNC_CALL_H
