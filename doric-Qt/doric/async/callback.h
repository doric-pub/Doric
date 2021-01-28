#ifndef CALLBACK_H
#define CALLBACK_H

#include <QJSValue>

class Callback {
public:
    virtual void onResult(QJSValue result) = 0;

    virtual void onError(QJSValue error) = 0;

    virtual void onFinish() = 0;
};

#endif // CALLBACK_H
