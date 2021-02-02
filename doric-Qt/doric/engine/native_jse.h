#ifndef NATIVE_JSE_H
#define NATIVE_JSE_H

#include <QJSEngine>
#include "interface_jse.h"

class NativeJSE : public InterfaceJSE
{
private:
    QJSEngine mJSEngine;
public:
    NativeJSE();

    QString loadJS(QString script, QString source) override;

    void injectGlobalJSObject(QString name, QObject *object) override;

    void injectGlobalJSFunction(QString name, QObject *function, QString property) override;

    QJSValue invokeObject(QString objectName, QString functionName, QVariantList arguments) override;
};

#endif // NATIVE_JSE_H
