#ifndef DORICSUPERNODE_H
#define DORICSUPERNODE_H

#include "DoricViewNode.h"

class DoricSuperNode : public DoricViewNode {
protected:
  void blendSubLayoutConfig(DoricViewNode *viewNode);

public:
  using DoricViewNode::DoricViewNode;
};

#endif // DORICSUPERNODE_H
