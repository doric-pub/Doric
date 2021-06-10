#ifndef DORICPROMISE_H
#define DORICPROMISE_H

#include <QDebug>

#include "DoricContext.h"
#include "utils/DoricConstant.h"

#include "DoricExport.h"

class DORIC_EXPORT DoricPromise {
public:
  static void resolve(DoricContext *context, QString callbackId,
                      QVariantList args) {
    QVariantList params;
    params.append(context->getContextId());
    params.append(callbackId);

    foreach (QVariant arg, args) { params.append(arg); }

    context->getDriver()->invokeDoricMethod(DoricConstant::DORIC_BRIDGE_RESOLVE,
                                            params);
  }

  static void reject(DoricContext *context, QString callbackId,
                     QVariantList args) {
    QVariantList params;
    params.append(context->getContextId());
    params.append(callbackId);

    foreach (QVariant arg, args) { params.append(arg); }

    context->getDriver()->invokeDoricMethod(DoricConstant::DORIC_BRIDGE_REJECT,
                                            params);
  }
};

#endif // DORICPROMISE_H
