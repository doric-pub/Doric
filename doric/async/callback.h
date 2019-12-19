#ifndef CALLBACK_H
#define CALLBACK_H

#include <QException>

template <class R>
class Callback {

public:

    virtual void onResult(R result) = 0;

    virtual void onError(QException exception) = 0;

    virtual void onFinish() = 0;
};

#endif // CALLBACK_H
