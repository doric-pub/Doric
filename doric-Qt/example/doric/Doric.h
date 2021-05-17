#ifndef DORIC_H
#define DORIC_H

#include "DoricLibrary.h"

class Doric {
public:
  static void registerLibrary(DoricLibrary *doricLibrary) {
    DoricRegistry::getInstance()->registerLibrary(doricLibrary);
  }
};

#endif // DORIC_H
