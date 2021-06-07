#ifndef NATIVEDRIVER_H
#define NATIVEDRIVER_H

#include <QDebug>

#include "DoricExport.h"

#include "DoricInterfaceDriver.h"
#include "engine/DoricJSEngine.h"

class DORIC_EXPORT DoricNativeDriver : public DoricInterfaceDriver {
private:
  static DoricNativeDriver *local_instance;
  DoricNativeDriver() { qDebug() << "DoricNativeDriver constructor"; }

  ~DoricNativeDriver() { qDebug() << "DoricNativeDriver destructor"; }

  DoricJSEngine jsEngine;

public:
  static DoricNativeDriver *getInstance() {
    static DoricNativeDriver instance;
    return &instance;
  }

  std::shared_ptr<DoricAsyncResult>
  invokeContextEntityMethod(QString contextId, QString method,
                            QVariantList args) override;

  std::shared_ptr<DoricAsyncResult>
  invokeDoricMethod(QString method, QVariantList args) override;

  std::shared_ptr<DoricAsyncResult> asyncCall(std::function<void()> lambda,
                                              DoricThreadMode mode) override;

  std::shared_ptr<DoricAsyncResult>
  createContext(QString contextId, QString script, QString source) override;

  std::shared_ptr<DoricAsyncResult> destroyContext(QString contextId) override;

  DoricRegistry *getRegistry() override;
};
#endif // NATIVEDRIVER_H
