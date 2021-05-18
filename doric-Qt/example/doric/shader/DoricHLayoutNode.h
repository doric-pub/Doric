#ifndef DORICHLAYOUTNODE_H
#define DORICHLAYOUTNODE_H

#include "DoricExport.h"

#include "DoricGroupNode.h"

class DORIC_EXPORT DoricHLayoutNode : public DoricGroupNode {
public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICHLAYOUTNODE_H
