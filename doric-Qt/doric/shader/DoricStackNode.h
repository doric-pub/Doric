#ifndef DORICSTACKNODE_H
#define DORICSTACKNODE_H

#include "DoricGroupNode.h"

class DoricStackNode : public DoricGroupNode
{
public:
    using DoricGroupNode::DoricGroupNode;

    QQuickItem *build() override;

    void blendLayoutConfig() override;
};

#endif // DORICSTACKNODE_H
