#ifndef DORICVLAYOUTNODE_H
#define DORICVLAYOUTNODE_H

#include "DoricExport.h"

#include "DoricGroupNode.h"

class DORIC_EXPORT DoricVLayoutNode : public DoricGroupNode {
public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICVLAYOUTNODE_H
