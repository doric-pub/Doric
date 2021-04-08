#ifndef DORICSCROLLERNODE_H
#define DORICSCROLLERNODE_H

#include "DoricSuperNode.h"

class DoricScrollerNode : public DoricSuperNode {
private:
  DoricViewNode *mChildNode = nullptr;

  QString mChildViewId;
  QString onScrollFuncId;
  QString onScrollEndFuncId;

public:
  using DoricSuperNode::DoricSuperNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blend(QJsonValue jsValue) override;

  virtual void blendSubNode(QJsonValue subProperties) override;
};

#endif // DORICSCROLLERNODE_H
