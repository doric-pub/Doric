#ifndef DORICHLAYOUTNODE_H
#define DORICHLAYOUTNODE_H


#include "DoricGroupNode.h"

class DoricHLayoutNode : public DoricGroupNode {
public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICHLAYOUTNODE_H
