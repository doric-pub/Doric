#ifndef DORICINTERFACELOADER_H
#define DORICINTERFACELOADER_H

#include "async/DoricAsyncResult.h"

#include <QString>

class DoricInterfaceLoader {
public:
  virtual bool filter(QString source) = 0;

  virtual std::shared_ptr<DoricAsyncResult> request(QString source) = 0;
};

#endif // DORICINTERFACELOADER_H
