#ifndef ASYNCRESULT_H
#define ASYNCRESULT_H

#include <QJSValue>

#include "DoricExport.h"

#include "DoricSettableFuture.h"

static QString EMPTY("");

class DORIC_EXPORT DoricAsyncResult {
private:
  QString result = EMPTY;

public:
  std::function<void()> resultCallback;
  std::function<void()> exceptionCallback;
  std::function<void()> finishCallback;

  DoricAsyncResult();

  void setResult(QString result);

  void setError(QString exception);

  bool hasResult();

  QJSValue getResult();

  DoricSettableFuture *synchronous();
};

#endif // ASYNCRESULT_H
