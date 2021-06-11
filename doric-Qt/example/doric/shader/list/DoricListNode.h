#ifndef DORICLISTNODE_H
#define DORICLISTNODE_H

#include "DoricExport.h"

#include "DoricListItemNode.h"
#include "shader/DoricSuperNode.h"

class DORIC_EXPORT DoricListNode : public DoricSuperNode {

private:
  QString renderItemFuncId;
  int itemCount = 0;
  int batchCount = 15;
  QString onLoadMoreFuncId;
  bool loadMore = false;
  QString loadMoreViewId;
  QString onScrollFuncId;
  QString onScrollEndFuncId;
  QList<DoricListItemNode *> childNodes;

public:
  using DoricSuperNode::DoricSuperNode;

  QQuickItem *build() override;

  virtual DoricViewNode *getSubNodeById(QString id) override;

  virtual void blendSubNode(QJsonValue subProperties) override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void afterBlended(QJsonValue prop) override;
};

#endif // DORICLISTNODE_H
