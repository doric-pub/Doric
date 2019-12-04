#include "native_driver.h"

NativeDriver::~NativeDriver() {
    qDebug() << "NativeDriver destructor";
}

void NativeDriver::createContext(int contextId, QString *script)  {
    jsEngine->prepareContext(contextId, script);
}

void NativeDriver::destroyContext(int contextId)  {
    jsEngine->destroyContext(contextId);
}

void NativeDriver::invokeContextEntityMethod(int contextId, QString* method, QVector<QObject>* arguments) {

}
