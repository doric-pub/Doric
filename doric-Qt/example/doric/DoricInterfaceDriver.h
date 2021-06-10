#ifndef INTERFACEDRIVER_H
#define INTERFACEDRIVER_H

#include <QRunnable>
#include <QString>
#include <QVariant>

#include "DoricExport.h"

#include "DoricRegistry.h"
#include "async/DoricAsyncResult.h"
#include "utils/DoricThreadMode.h"

class DORIC_EXPORT DoricInterfaceDriver {
public:
  virtual std::shared_ptr<DoricAsyncResult>
  invokeContextEntityMethod(QString contextId, QString method,
                            QVariantList args) = 0;

  virtual std::shared_ptr<DoricAsyncResult>
  invokeDoricMethod(QString method, QVariantList args) = 0;

  virtual std::shared_ptr<DoricAsyncResult>
  asyncCall(std::function<void()> lambda, DoricThreadMode mode) = 0;

  virtual std::shared_ptr<DoricAsyncResult>
  createContext(QString contextId, QString script, QString source) = 0;

  virtual std::shared_ptr<DoricAsyncResult>
  destroyContext(QString contextId) = 0;

  virtual DoricRegistry *getRegistry() = 0;
};

#endif // INTERFACEDRIVER_H
