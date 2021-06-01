#ifndef DORICSLIDERNODE_H
#define DORICSLIDERNODE_H

#include "DoricExport.h"

#include "DoricSlideItemNode.h"
#include "shader/DoricSuperNode.h"

class DORIC_EXPORT DoricSliderNode : public DoricSuperNode {

private:
  int itemCount = 0;
  QString renderPageFuncId;
  int batchCount = 15;
  QString onPageSlidedFuncId;
  bool loop = false;
  QList<DoricSlideItemNode *> childNodes;

public:
  using DoricSuperNode::DoricSuperNode;

  QQuickItem *build() override;

  virtual DoricViewNode *getSubNodeById(QString id) override;

  virtual void blendSubNode(QJsonValue subProperties) override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void afterBlended(QJsonValue prop) override;

  void onPageSlided();
};

#endif // DORICSLIDERNODE_H
