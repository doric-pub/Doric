#ifndef NATIVE_JSE_H
#define NATIVE_JSE_H

#include "DoricExport.h"

#include "DoricInterfaceJSE.h"
#include "native/NativeExecutor.h"
#include "v8/V8Executor.h"

enum class JSEType { V8, Native };

class DORIC_EXPORT DoricNativeJSE : public DoricInterfaceJSE {
private:
  JSEType mType;

  V8Executor *v8Executor;
  NativeExecutor *nativeExecutor;

public:
  DoricNativeJSE(JSEType type);

  QString loadJS(QString script, QString source) override;

  void injectGlobalJSObject(QString name, QObject *object) override;

  void injectGlobalJSFunction(QString name, QObject *function,
                              QString property) override;

  QString invokeObject(QString objectName, QString functionName,
                       QVariantList arguments) override;
};

#endif // NATIVE_JSE_H
