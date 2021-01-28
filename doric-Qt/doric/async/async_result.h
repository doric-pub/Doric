#ifndef ASYNCRESULT_H
#define ASYNCRESULT_H

#include <QJSValue>

#include "callback.h"
#include "settable_future.h"

static QJSValue EMPTY(QJSValue::NullValue);

class AsyncResult
{
private:
    QJSValue result = EMPTY;
    Callback *callback;

public:
    AsyncResult();

    AsyncResult(QJSValue result);

    void setResult(QJSValue result);

    void setError(QJSValue exception);

    bool hasResult();

    QJSValue getResult();

    void setCallback(Callback *callback);

    SettableFuture *synchronous();
};

#endif // ASYNCRESULT_H
