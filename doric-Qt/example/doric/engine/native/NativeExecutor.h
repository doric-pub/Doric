#ifndef NATIVEEXECUTOR_H
#define NATIVEEXECUTOR_H

#include <QJSEngine>

#include "DoricExport.h"

class DORIC_EXPORT NativeExecutor {

private:
  QJSEngine *mJSEngine;

public:
  NativeExecutor();

  ~NativeExecutor();

  QString loadJS(QString script, QString source);

  void injectGlobalJSObject(QString name, QObject *object);

  void injectGlobalJSFunction(QString name, QObject *function,
                              QString property);

  QJSValue invokeObject(QString objectName, QString functionName,
                        QVariantList arguments);
};

#endif // NATIVEEXECUTOR_H
