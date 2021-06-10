#ifndef DORIC_H
#define DORIC_H

#include "DoricExport.h"

#include "DoricLibrary.h"

class DORIC_EXPORT Doric {
public:
  static void registerLibrary(DoricLibrary *doricLibrary) {
    DoricRegistry::getInstance()->registerLibrary(doricLibrary);
  }
};

#endif // DORIC_H
