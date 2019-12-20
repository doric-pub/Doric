#ifndef CUSTOM_CALLBACK_H
#define CUSTOM_CALLBACK_H

#include <QDebug>

#include "async/callback.h"

template <class R>
class CustomCallback : public Callback<R> {

public:
    void onResult(R result) override {
        qDebug() << result;
    }

    void onError(QException exception) override {
        qDebug() << exception.what();
    }

    void onFinish() override {

    }
};

#endif // CUSTOM_CALLBACK_H
