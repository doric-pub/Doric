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
};

#endif // ASYNC_CALL_H
