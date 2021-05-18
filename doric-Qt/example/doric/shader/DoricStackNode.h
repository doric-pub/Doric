#ifndef DORICSTACKNODE_H
#define DORICSTACKNODE_H

#include "DoricExport.h"

#include "DoricGroupNode.h"

class DORIC_EXPORT DoricStackNode : public DoricGroupNode {
public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;

  void blendLayoutConfig(QJsonValue jsValue) override;
};

#endif // DORICSTACKNODE_H
