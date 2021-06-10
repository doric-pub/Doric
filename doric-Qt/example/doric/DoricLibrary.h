#ifndef DORICLIBRARY_H
#define DORICLIBRARY_H

#include "DoricExport.h"

#include "DoricRegistry.h"

class DORIC_EXPORT DoricLibrary {
public:
  virtual void load(DoricRegistry *registry) = 0;
};

#endif // DORICLIBRARY_H
