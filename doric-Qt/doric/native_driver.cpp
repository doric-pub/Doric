#include "native_driver.h"
#include "async/async_call.h"

void NativeDriver::invokeContextEntityMethod(QString contextId, QString method, QList<QObject> args)
{

}

void NativeDriver::invokeDoricMethod(QString method, QList<QObject> args)
{

}

void NativeDriver::createContext(QString contextId, QString script, QString source)
{
    class Runnable: public QRunnable
    {
        void run() override
        {
            qDebug() << "123";
        }
    };
    Runnable *runnable = new Runnable();
    runnable->setAutoDelete(true);

    AsyncCall::ensureRunInThreadPool(jsEngine.mJSThreadPool, runnable);
}

void NativeDriver::destroyContext(QString contextId)
{

}
