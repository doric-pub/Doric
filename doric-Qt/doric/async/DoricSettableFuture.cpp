#include <QDebug>

#include "DoricSettableFuture.h"

void DoricSettableFuture::set(QJSValue result) {
  if (mReadyLatch == NULL) {
    qDebug() << "Result has already been set!";
    return;
  }
  mResult = result;
  delete mReadyLatch;
}

QJSValue DoricSettableFuture::get() {
  mReadyLatch->lock();
  return mResult;
}
