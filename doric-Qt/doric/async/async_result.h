#ifndef ASYNC_RESULT_H
#define ASYNC_RESULT_H

#include <QDebug>
#include <QVariant>

#include "callback.h"

template <class R>
class AsyncResult {

private:
    QVariant result;
    Callback<R> *callback = nullptr;

public:
    AsyncResult() {}

    AsyncResult(R result) {
        this->result.setValue(result);
    }

    void setResult(R result) {
        this->result.setValue(result);
        if (callback != nullptr) {
            this->callback->onResult(result);
            this->callback->onFinish();
        }
    }

    void setError(QException exception) {
        this->result->setValue(exception);
        if (callback != nullptr) {
            this->callback->onError(exception);
            this->callback->onFinish();
        }
    }

    bool hasResult() {
        qDebug() << result.typeName();
        return !QString(result.typeName()).isEmpty();
    }

    R *getResult() {
        return static_cast<R*>(result.data());
    }

    void setCallback(Callback<R> *callback) {
        this->callback = callback;
        if (QException *exception = static_cast<QException*>(result.data())) {
            this->callback->onError(*exception);
            this->callback->onFinish();
        } else if (hasResult()) {
            this->callback->onResult(*getResult());
            this->callback->onFinish();
        }
    }
};

#endif // ASYNC_RESULT_H
