#ifndef DORICNATIVEPLUGIN_H
#define DORICNATIVEPLUGIN_H

#include "DoricExport.h"

#include "../utils/DoricContextHolder.h"

class DORIC_EXPORT DoricNativePlugin : public DoricContextHolder {
public:
  using DoricContextHolder::DoricContextHolder;
};

#endif // DORICNATIVEPLUGIN_H
