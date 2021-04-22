#ifndef DORICPROMISE_H
#define DORICPROMISE_H

#include <QDebug>

#include "DoricContext.h"
#include "utils/DoricConstant.h"

class DoricPromise {
public:
  static void resolve(DoricContext *context, QString callbackId) {
    QVariantList params;
    params.append(context->getContextId());
    params.append(callbackId);
    context->getDriver()->invokeDoricMethod(DoricConstant::DORIC_BRIDGE_RESOLVE,
                                            params);
  }
};

#endif // DORICPROMISE_H
