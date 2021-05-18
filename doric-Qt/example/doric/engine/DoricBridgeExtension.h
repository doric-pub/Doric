#ifndef BRIDGEEXTENSION_H
#define BRIDGEEXTENSION_H

#include <QJSValue>
#include <QObject>

#include "DoricExport.h"

class DORIC_EXPORT DoricBridgeExtension : public QObject {
  Q_OBJECT
public:
  explicit DoricBridgeExtension(QObject *parent = nullptr);

  Q_INVOKABLE void callNative(QString contextId, QString module,
                              QString methodName, QString callbackId,
                              QString argument);
};

#endif // BRIDGEEXTENSION_H
