#ifndef DORICGROUPNODE_H
#define DORICGROUPNODE_H

#include "DoricSuperNode.h"

class DoricGroupNode : public DoricSuperNode {
public:
  using DoricSuperNode::DoricSuperNode;

  virtual void blend(QQuickItem *view, QString name, QJSValue prop) override;

  virtual void blend(QJSValue jsValue) override;

protected:
  QList<DoricViewNode *> mChildNodes;

  QList<QString> mChildViewIds;

  void configChildNode();
};

#endif // DORICGROUPNODE_H
