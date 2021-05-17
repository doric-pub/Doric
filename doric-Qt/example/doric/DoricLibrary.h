#ifndef DORICLIBRARY_H
#define DORICLIBRARY_H

#include "DoricRegistry.h"

class DoricLibrary {
public:
  virtual void load(DoricRegistry *registry) = 0;
};

#endif // DORICLIBRARY_H
