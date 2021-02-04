#ifndef INTERFACE_JSE_H
#define INTERFACE_JSE_H

#include <QJSValue>
#include <QString>
#include <QVariant>

class DoricInterfaceJSE {
public:
  virtual QString loadJS(QString script, QString source) = 0;

  virtual void injectGlobalJSObject(QString name, QObject *object) = 0;

  virtual void injectGlobalJSFunction(QString name, QObject *function,
                                      QString property) = 0;

  virtual QJSValue invokeObject(QString objectName, QString functionName,
                                QVariantList arguments) = 0;
};

#endif // INTERFACE_JSE_H
