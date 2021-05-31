#ifndef DORICSLIDEITEMNODE_H
#define DORICSLIDEITEMNODE_H

#include "DoricExport.h"

#include "shader/DoricStackNode.h"

class DORIC_EXPORT DoricSlideItemNode : public DoricStackNode {
public:
  using DoricStackNode::DoricStackNode;

  QQuickItem *build() override;

  void apply();
};

#endif // DORICSLIDEITEMNODE_H
