#ifndef ASYNC_CALL_H
#define ASYNC_CALL_H

#include <QThreadPool>
#include <QtConcurrent/QtConcurrent>

class DoricAsyncCall {

public:
  static void ensureRunInThreadPool(QThreadPool *threadPool,
                                    std::function<void()> lambda) {
    QtConcurrent::run(threadPool, lambda);
  }
};

#endif // ASYNC_CALL_H
