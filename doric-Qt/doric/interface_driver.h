#ifndef INTERFACEDRIVER_H
#define INTERFACEDRIVER_H

#include <QString>
#include <QVariant>

class InterfaceDriver
{
public:
    virtual void invokeContextEntityMethod(QString contextId, QString method, QVariantList args) = 0;

    virtual void invokeDoricMethod(QString method, QVariantList args) = 0;

    virtual void createContext(QString contextId, QString script, QString source) = 0;

    virtual void destroyContext(QString contextId) = 0;
};

#endif // INTERFACEDRIVER_H
