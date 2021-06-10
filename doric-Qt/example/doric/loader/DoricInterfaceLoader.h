#ifndef DORICINTERFACELOADER_H
#define DORICINTERFACELOADER_H

#include <QString>

#include "DoricExport.h"

#include "async/DoricAsyncResult.h"

class DORIC_EXPORT DoricInterfaceLoader {
public:
  virtual bool filter(QString source) = 0;

  virtual std::shared_ptr<DoricAsyncResult> request(QString source) = 0;
};

#endif // DORICINTERFACELOADER_H
