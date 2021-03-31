#ifndef NATIVE_JSE_H
#define NATIVE_JSE_H

#include "DoricInterfaceJSE.h"
#include "native/NativeExecutor.h"
#include "v8/V8Executor.h"

class DoricNativeJSE : public DoricInterfaceJSE {
private:
  V8Executor *v8Executor;
  NativeExecutor *nativeExecutor;

public:
  DoricNativeJSE();

  QString loadJS(QString script, QString source) override;

  void injectGlobalJSObject(QString name, QObject *object) override;

  void injectGlobalJSFunction(QString name, QObject *function,
                              QString property) override;

  QJSValue invokeObject(QString objectName, QString functionName,
                        QVariantList arguments) override;
};

#endif // NATIVE_JSE_H
