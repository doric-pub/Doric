#ifndef NATIVE_JSE_H
#define NATIVE_JSE_H

#include "DoricInterfaceJSE.h"
#include <QJSEngine>

class DoricNativeJSE : public DoricInterfaceJSE {
private:
  QJSEngine mJSEngine;

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
