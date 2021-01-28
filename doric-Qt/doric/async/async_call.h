#ifndef ASYNC_CALL_H
#define ASYNC_CALL_H

#include <QThreadPool>

class AsyncCall {

public:
    static void ensureRunInThreadPool(QThreadPool &threadPool, QRunnable *runnable)
    {

    }
};

#endif // ASYNC_CALL_H
