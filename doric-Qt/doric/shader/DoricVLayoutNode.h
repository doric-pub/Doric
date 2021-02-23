#ifndef DORICVLAYOUTNODE_H
#define DORICVLAYOUTNODE_H

#include "DoricGroupNode.h"

class DoricVLayoutNode : public DoricGroupNode {
public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;
};

#endif // DORICVLAYOUTNODE_H
