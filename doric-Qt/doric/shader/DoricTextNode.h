#ifndef DORICTEXTNODE_H
#define DORICTEXTNODE_H

#include "DoricViewNode.h"

class DoricTextNode : public DoricViewNode {
public:
  using DoricViewNode::DoricViewNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJSValue prop) override;
};

#endif // DORICTEXTNODE_H
