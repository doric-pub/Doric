#ifndef DORICSLIDERNODE_H
#define DORICSLIDERNODE_H

#include "shader/DoricSuperNode.h"

class DoricSliderNode : public DoricSuperNode {

public:
  using DoricSuperNode::DoricSuperNode;

  QQuickItem *build() override;

  virtual DoricViewNode *getSubNodeById(QString id) override;

  virtual void blendSubNode(QJsonValue subProperties) override;

  virtual void blend(QJsonValue jsValue) override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICSLIDERNODE_H
