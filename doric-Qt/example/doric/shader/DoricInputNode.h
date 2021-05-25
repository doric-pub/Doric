#ifndef DORICINPUTNODE_H
#define DORICINPUTNODE_H

#include "DoricExport.h"

#include "DoricViewNode.h"

class DORIC_EXPORT DoricInputNode : public DoricViewNode {
public:
  using DoricViewNode::DoricViewNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICINPUTNODE_H
