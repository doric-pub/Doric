#include <QDebug>

#include "settable_future.h"

void SettableFuture::set(QJSValue result)
{
    if (mReadyLatch == NULL)
    {
        qDebug() << "Result has already been set!";
        return;
    }
    mResult = result;
    delete mReadyLatch;
}

QJSValue SettableFuture::get()
{
    mReadyLatch->lock();
    return mResult;
}
