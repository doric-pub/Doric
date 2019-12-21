#ifndef JS_ENGINE_H
#define JS_ENGINE_H

#include <QJSEngine>

#include "native/native_bridge.h"
#include "native/native_empty.h"
#include "native/native_log.h"
#include "native/native_timer.h"
#include "registry.h"

class JSEngine {

public:
    QJSEngine *engine = new QJSEngine();

    Registry *registry = new Registry();

    JSEngine();

    void prepareContext(int contextId, QString *script);

    void destroyContext(int contextId);

private:
    NativeLog *nativeLog = new NativeLog();
    NativeTimer *nativeTimer = new NativeTimer(engine);
    NativeEmpty *nativeEmpty = new NativeEmpty();
    NativeBridge *nativeBridge = new NativeBridge();

    void initJSEngine();

    void injectGlobal();

    void initDoricRuntime();
};

#endif // JS_ENGINE_H
