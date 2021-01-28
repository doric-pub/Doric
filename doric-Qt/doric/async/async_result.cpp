#include "async_result.h"

AsyncResult::AsyncResult()
{

}

AsyncResult::AsyncResult(QJSValue result)
{
    this->result = result;
}

void AsyncResult::setResult(QJSValue result)
{
    this->result = result;
    if (this->callback != NULL) {
        this->callback->onResult(result);
        this->callback->onFinish();
    }
}

void AsyncResult::setError(QJSValue exception)
{
    this->result = exception;
    if (this->callback != NULL) {
        this->callback->onResult(result);
        this->callback->onFinish();
    }
}

bool AsyncResult::hasResult()
{
    return !result.equals(EMPTY);
}

QJSValue AsyncResult::getResult()
{
    return this->result;
}

void AsyncResult::setCallback(Callback *callback)
{
    this->callback = callback;
    if (this->result.isError()) {
        this->callback->onError(result);
        this->callback->onFinish();
    } else if (!result.equals(EMPTY)) {
        this->callback->onResult(result);
        this->callback->onFinish();
    }
}

SettableFuture* AsyncResult::synchronous()
{
    return NULL;
}
