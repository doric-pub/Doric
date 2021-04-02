#ifndef DORICGROUPNODE_H
#define DORICGROUPNODE_H

#include "DoricSuperNode.h"

class DoricGroupNode : public DoricSuperNode {
public:
  using DoricSuperNode::DoricSuperNode;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blend(QJsonValue jsValue) override;

protected:
  QList<DoricViewNode *> mChildNodes;

  QList<QString> mChildViewIds;

  void configChildNode();

  virtual void blendSubNode(QJsonValue subProperties) override;
};

#endif // DORICGROUPNODE_H
