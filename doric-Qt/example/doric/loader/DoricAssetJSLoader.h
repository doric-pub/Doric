#ifndef DORICASSETJSLOADER_H
#define DORICASSETJSLOADER_H

#include "DoricExport.h"

#include "DoricInterfaceLoader.h"

class DORIC_EXPORT DoricAssetJSLoader : public DoricInterfaceLoader {
public:
  DoricAssetJSLoader();

  virtual bool filter(QString source) override;

  virtual std::shared_ptr<DoricAsyncResult> request(QString source) override;
};

#endif // DORICASSETJSLOADER_H
