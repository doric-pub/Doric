#ifndef BRIDGEEXTENSION_H
#define BRIDGEEXTENSION_H

#include <QObject>
#include <QJSValue>

class BridgeExtension : public QObject
{
    Q_OBJECT
public:
    explicit BridgeExtension(QObject *parent = nullptr);

    void callNative(QString contextId, QString module, QString methodName, QString callbackId, QJSValue jsValue);
};

#endif // BRIDGEEXTENSION_H
