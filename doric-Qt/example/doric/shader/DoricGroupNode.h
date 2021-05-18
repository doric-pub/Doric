#ifndef DORICGROUPNODE_H
#define DORICGROUPNODE_H

#include "DoricExport.h"

#include "DoricSuperNode.h"

class DORIC_EXPORT DoricGroupNode : public DoricSuperNode {
public:
  using DoricSuperNode::DoricSuperNode;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blend(QJsonValue jsValue) override;

protected:
  QList<DoricViewNode *> mChildNodes;

  QList<QString> mChildViewIds;

  void configChildNode();

  virtual void blendSubNode(QJsonValue subProperties) override;

  virtual void afterBlended(QJsonValue props) override;

  virtual void requestLayout() override;

  virtual DoricViewNode *getSubNodeById(QString id) override;
};

#endif // DORICGROUPNODE_H
