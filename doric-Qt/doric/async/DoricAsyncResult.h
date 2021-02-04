#ifndef ASYNCRESULT_H
#define ASYNCRESULT_H

#include <QJSValue>

#include "DoricCallback.h"
#include "DoricSettableFuture.h"

static QJSValue EMPTY(QJSValue::NullValue);

class DoricAsyncResult {
private:
  QJSValue result = EMPTY;
  DoricCallback *callback;

public:
  DoricAsyncResult();

  DoricAsyncResult(QJSValue result);

  void setResult(QJSValue result);

  void setError(QJSValue exception);

  bool hasResult();

  QJSValue getResult();

  void setCallback(DoricCallback *callback);

  DoricSettableFuture *synchronous();
};

#endif // ASYNCRESULT_H
