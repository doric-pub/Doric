#ifndef NATIVEDRIVER_H
#define NATIVEDRIVER_H

#include <QDebug>

#include "DoricInterfaceDriver.h"
#include "engine/DoricJSEngine.h"

class DoricNativeDriver : public DoricInterfaceDriver {
private:
  static DoricNativeDriver *local_instance;
  DoricNativeDriver() {}

  ~DoricNativeDriver() {}

  DoricJSEngine jsEngine;

public:
  static DoricNativeDriver *getInstance() {
    static DoricNativeDriver instance;
    return &instance;
  }

  void invokeContextEntityMethod(QString contextId, QString method,
                                 QVariantList args) override;

  void invokeDoricMethod(QString method, QVariantList args) override;

  DoricAsyncResult * asyncCall(QRunnable *runnable, DoricThreadMode mode) override;

  void createContext(QString contextId, QString script,
                     QString source) override;

  void destroyContext(QString contextId) override;

  DoricRegistry *getRegistry() override;
};
#endif // NATIVEDRIVER_H
