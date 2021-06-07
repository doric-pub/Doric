#ifndef DORICSUPERNODE_H
#define DORICSUPERNODE_H

#include <QJsonArray>

#include "DoricExport.h"

#include "DoricViewNode.h"

class DORIC_EXPORT DoricSuperNode : public DoricViewNode {
private:
  QMap<QString, QJsonValue> subNodes;

protected:
  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blendSubNode(QJsonValue subProperties) = 0;

  void recursiveMixin(QJsonValue src, QJsonValue target);

public:
  using DoricViewNode::DoricViewNode;

  bool mReusable = false;

  QJsonValue getSubModel(QString id);

  void blendSubLayoutConfig(DoricViewNode *viewNode, QJsonValue jsValue);

  virtual DoricViewNode *getSubNodeById(QString id) = 0;

  virtual void blendSubNode(DoricViewNode *subNode, QJsonValue layoutConfig);

private:
  void mixinSubNode(QJsonValue subNode);

  void mixin(QJsonValue src, QJsonValue target);

  bool viewIdIsEqual(QJsonValue src, QJsonValue target);
};

#endif // DORICSUPERNODE_H
