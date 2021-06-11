#ifndef DORICLISTITEMNODE_H
#define DORICLISTITEMNODE_H

#include "DoricExport.h"

#include "shader/DoricStackNode.h"

class DORIC_EXPORT DoricListItemNode : public DoricStackNode {
public:
  using DoricStackNode::DoricStackNode;

  QQuickItem *build() override;

  void apply();
};

#endif // DORICLISTITEMNODE_H
