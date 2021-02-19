#ifndef DORICVIEWNODE_H
#define DORICVIEWNODE_H

#include <QQuickItem>

#include "../utils/DoricContextHolder.h"

class DoricViewNode : public DoricContextHolder {

protected:
  QQuickItem *mView;

  virtual QQuickItem *build() = 0;

  virtual void blendLayoutConfig();

private:
  QString mId;
  QString mType;

public:
  using DoricContextHolder::DoricContextHolder;
};
#endif // DORICVIEWNODE_H
