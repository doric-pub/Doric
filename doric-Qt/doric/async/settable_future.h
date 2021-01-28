#ifndef SETTABLE_FUTURE_H
#define SETTABLE_FUTURE_H

#include <QJSValue>
#include "utils/count_down_latch.h"

class SettableFuture {
private:
    QJSValue mResult;
    CountDownLatch *mReadyLatch = new CountDownLatch();

public:
    void set(QJSValue result);

    QJSValue get();
};

#endif // SETTABLE_FUTURE_H
