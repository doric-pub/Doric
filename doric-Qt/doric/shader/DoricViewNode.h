#ifndef DORICVIEWNODE_H
#define DORICVIEWNODE_H

#include <QQuickItem>

#include "../utils/DoricContextHolder.h"

class DoricSuperNode;

class DoricViewNode : public DoricContextHolder {

protected:
  QQuickItem *mView;

  DoricSuperNode *mSuperNode;

  virtual QQuickItem *build() = 0;

  virtual void blendLayoutConfig();

  void setLayoutConfig(QJSValue layoutConfig);

private:
  QString mId;
  QString mType;

public:
  using DoricContextHolder::DoricContextHolder;

  void init(DoricSuperNode *superNode);

  QString getId();

  void setId(QString id);

  void blend(QJSValue jsValue);
};
#endif // DORICVIEWNODE_H
