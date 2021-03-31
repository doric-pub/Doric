#include <QDebug>
#include <QJSValueIterator>

#include "../utils/DoricUtils.h"
#include "DoricNativeJSE.h"

DoricNativeJSE::DoricNativeJSE() {
  v8Executor = new V8Executor();
//  nativeExecutor = new NativeExecutor();
}

QString DoricNativeJSE::loadJS(QString script, QString source) {
//  return nativeExecutor->loadJS(script, source);
  return v8Executor->loadJS(script, source);
}

void DoricNativeJSE::injectGlobalJSObject(QString name, QObject *object) {
//  nativeExecutor->injectGlobalJSObject(name, object);
  v8Executor->injectGlobalJSObject(name, object);
}

void DoricNativeJSE::injectGlobalJSFunction(QString name, QObject *function,
                                            QString property) {
//  nativeExecutor->injectGlobalJSFunction(name, function, property);
  //  v8Executor->injectGlobalJSFunction(name, function, property);
}

QJSValue DoricNativeJSE::invokeObject(QString objectName, QString functionName,
                                      QVariantList arguments) {
    return QJSValue::UndefinedValue;
//  return nativeExecutor->invokeObject(objectName, functionName, arguments);
  //  return v8Executor->invokeObject(objectName, functionName, arguments);
}
