#ifndef DORICSUPERNODE_H
#define DORICSUPERNODE_H

#include "DoricViewNode.h"

class DoricSuperNode : public DoricViewNode {

protected:
  virtual void blend(QQuickItem *view, QString name, QJSValue prop) override;

  void blendSubLayoutConfig(DoricViewNode *viewNode);

public:
  using DoricViewNode::DoricViewNode;

  bool mReusable = false;
};

#endif // DORICSUPERNODE_H
