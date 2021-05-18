#ifndef DORICSCROLLERNODE_H
#define DORICSCROLLERNODE_H

#include "DoricExport.h"

#include "DoricSuperNode.h"

class DORIC_EXPORT DoricScrollerNode : public DoricSuperNode {
private:
  DoricViewNode *mChildNode = nullptr;

  QString mChildViewId;
  QString onScrollFuncId;
  QString onScrollEndFuncId;

public:
  using DoricSuperNode::DoricSuperNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blendSubNode(QJsonValue subProperties) override;

  virtual void afterBlended(QJsonValue jsValue) override;

  virtual void requestLayout() override;

  QSizeF sizeThatFits(QSizeF size);

  virtual DoricViewNode *getSubNodeById(QString id) override;
};

#endif // DORICSCROLLERNODE_H
