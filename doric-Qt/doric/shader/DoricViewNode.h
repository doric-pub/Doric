#ifndef DORICVIEWNODE_H
#define DORICVIEWNODE_H

#include <QQmlComponent>

#include "../utils/DoricContextHolder.h"

class DoricViewNode : public DoricContextHolder {

protected:
  QQmlComponent mView;

  virtual QQmlComponent *build() = 0;

  virtual void blendLayoutConfig();

private:
  QString mId;
  QString mType;

public:
  using DoricContextHolder::DoricContextHolder;
};
#endif // DORICVIEWNODE_H
