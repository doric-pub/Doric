#ifndef DORICTEXTNODE_H
#define DORICTEXTNODE_H

#include "DoricExport.h"

#include "DoricViewNode.h"

class DORIC_EXPORT DoricTextNode : public DoricViewNode {
public:
  using DoricViewNode::DoricViewNode;

  QQuickItem *build() override;

  virtual void blendLayoutConfig(QJsonValue jsObject) override;

  virtual void blend(QJsonValue jsValue) override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICTEXTNODE_H
