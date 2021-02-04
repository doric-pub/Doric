#ifndef BRIDGEEXTENSION_H
#define BRIDGEEXTENSION_H

#include <QJSValue>
#include <QObject>

class DoricBridgeExtension : public QObject {
  Q_OBJECT
public:
  explicit DoricBridgeExtension(QObject *parent = nullptr);

  Q_INVOKABLE void callNative(QString contextId, QString module,
                              QString methodName, QString callbackId,
                              QJSValue jsValue);
};

#endif // BRIDGEEXTENSION_H
