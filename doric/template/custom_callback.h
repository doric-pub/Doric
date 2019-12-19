#ifndef CUSTOM_CALLBACK_H
#define CUSTOM_CALLBACK_H

#include "async/callback.h"

template <class R>
class CustomCallback : public Callback<R> {

public:
    void onResult(R result) override {

    }

    void onError(QException exception) override {

    }

    void onFinish() override {

    }
};

#endif // CUSTOM_CALLBACK_H
