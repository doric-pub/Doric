#ifndef SETTABLE_FUTURE_H
#define SETTABLE_FUTURE_H

#include <QJSValue>

#include "utils/DoricCountDownLatch.h"

class DoricSettableFuture {
private:
  QJSValue mResult;
  DoricCountDownLatch *mReadyLatch = new DoricCountDownLatch();

public:
  void set(QJSValue result);

  QJSValue get();
};

#endif // SETTABLE_FUTURE_H
