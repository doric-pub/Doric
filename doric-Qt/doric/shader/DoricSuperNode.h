#ifndef DORICSUPERNODE_H
#define DORICSUPERNODE_H

#include <QJsonArray>

#include "DoricViewNode.h"

class DoricSuperNode : public DoricViewNode {
private:
  QMap<QString, QJsonValue> subNodes;

protected:
  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blendSubNode(QJsonValue subProperties) = 0;

public:
  using DoricViewNode::DoricViewNode;

  bool mReusable = false;

  QJsonValue getSubModel(QString id);

  void blendSubLayoutConfig(DoricViewNode *viewNode, QJsonValue jsValue);

private:
  void mixinSubNode(QJsonValue subNode);

  void mixin(QJsonValue src, QJsonValue target);
};

#endif // DORICSUPERNODE_H
