#ifndef DORICSUPERNODE_H
#define DORICSUPERNODE_H

#include "DoricViewNode.h"

class DoricSuperNode : public DoricViewNode {
private:
  QMap<QString, QJSValue> subNodes;

protected:
  virtual void blend(QQuickItem *view, QString name, QJSValue prop) override;

  void blendSubLayoutConfig(DoricViewNode *viewNode);

  virtual void blendSubNode(QJSValue subProperties) = 0;

public:
  using DoricViewNode::DoricViewNode;

  bool mReusable = false;

  QJSValue getSubModel(QString id);

private:
  void mixinSubNode(QJSValue subNode);

  void mixin(QJSValue src, QJSValue target);
};

#endif // DORICSUPERNODE_H
