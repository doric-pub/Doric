#ifndef DORICVLAYOUTNODE_H
#define DORICVLAYOUTNODE_H

#include "DoricGroupNode.h"

class DoricVLayoutNode : public DoricGroupNode {
public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJSValue prop) override;
};

#endif // DORICVLAYOUTNODE_H
