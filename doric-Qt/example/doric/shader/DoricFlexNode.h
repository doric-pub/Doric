#ifndef DORICFLEXNODE_H
#define DORICFLEXNODE_H

#include "DoricExport.h"

#include "shader/DoricStackNode.h"

#include "yoga/YGLayout.h"

class DORIC_EXPORT DoricFlexNode : public DoricGroupNode {

public:
  using DoricGroupNode::DoricGroupNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  virtual void blendSubNode(DoricViewNode *subNode,
                            QJsonValue flexConfig) override;

private:
  void blendYoga(YGLayout *yoga, QJsonValue flexConfig);

  void blendYoga(YGLayout *yoga, QString name, QJsonValue prop);
};

#endif // DORICFLEXNODE_H
