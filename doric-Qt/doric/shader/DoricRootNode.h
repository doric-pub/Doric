#ifndef ROOTNODE_H
#define ROOTNODE_H

#include "DoricStackNode.h"

class DoricRootNode : public DoricStackNode {
public:
  using DoricStackNode::DoricStackNode;

  void setRootView();
};

#endif // ROOTNODE_H
