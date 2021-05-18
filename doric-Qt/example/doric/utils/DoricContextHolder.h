#ifndef DORICCONTEXTHOLDER_H
#define DORICCONTEXTHOLDER_H

#include "DoricExport.h"

#include "../DoricContext.h"

class DORIC_EXPORT DoricContextHolder : public QObject {
protected:
  DoricContext *mContext = NULL;

public:
  explicit DoricContextHolder(QObject *parent = nullptr);

  void setContext(DoricContext *context);

  DoricContext *getContext();
};

#endif // DORICCONTEXTHOLDER_H
