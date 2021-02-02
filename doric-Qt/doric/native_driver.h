#ifndef NATIVEDRIVER_H
#define NATIVEDRIVER_H

#include <QDebug>

#include "interface_driver.h"
#include "engine/js_engine.h"

class NativeDriver : public InterfaceDriver
{
private:
    static NativeDriver *local_instance;
    NativeDriver()
    {
        qDebug() << "constructor";
    }

    ~NativeDriver()
    {
        qDebug() << "destructor";
    }

    JSEngine jsEngine;

public:
    static NativeDriver *getInstance()
    {
        static NativeDriver instance;
        return &instance;
    }

    void invokeContextEntityMethod(QString contextId, QString method, QVariantList args) override;

    void invokeDoricMethod(QString method, QVariantList args) override;

    void createContext(QString contextId, QString script, QString source) override;

    void destroyContext(QString contextId) override;
};
#endif // NATIVEDRIVER_H
