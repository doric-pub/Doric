#ifndef DORICDRAGGABLENODE_H
#define DORICDRAGGABLENODE_H

#include "DoricExport.h"

#include "shader/DoricStackNode.h"

class DORIC_EXPORT DoricDraggableNode : public DoricStackNode {

private:
  QString onDrag;

public:
  using DoricStackNode::DoricStackNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;
};

#endif // DORICDRAGGABLENODE_H
