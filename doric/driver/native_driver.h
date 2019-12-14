#ifndef NATIVE_DRIVER_H
#define NATIVE_DRIVER_H

#include "driver.h"
#include "engine/js_engine.h"

class NativeDriver : public Driver {
    Q_INTERFACES(Driver)

private:
    static NativeDriver *local_instance;
    NativeDriver();

    ~NativeDriver() override;

    JSEngine *jsEngine = new JSEngine();

public:
    static NativeDriver *getInstance() {
        static NativeDriver locla_s;
        return &locla_s;
    }

    void createContext(int contextId, QString *script) override;
    void destroyContext(int contextId) override;

    void invokeContextEntityMethod(int contextId, QString *method, ...) override;
    void invokeDoricMethod(QString *method, ...) override;

    Registry * getRegistry() override;
};

#endif // NATIVE_DRIVER_H
