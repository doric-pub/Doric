#ifndef INTERFACEDRIVER_H
#define INTERFACEDRIVER_H

#include <QString>
#include <QVariant>

#include "DoricRegistry.h"

class DoricInterfaceDriver {
public:
  virtual void invokeContextEntityMethod(QString contextId, QString method,
                                         QVariantList args) = 0;

  virtual void invokeDoricMethod(QString method, QVariantList args) = 0;

  virtual void createContext(QString contextId, QString script,
                             QString source) = 0;

  virtual void destroyContext(QString contextId) = 0;

  virtual DoricRegistry *getRegistry() = 0;
};

#endif // INTERFACEDRIVER_H
