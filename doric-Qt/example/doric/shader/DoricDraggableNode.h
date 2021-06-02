#ifndef DORICDRAGGABLENODE_H
#define DORICDRAGGABLENODE_H

#include "DoricExport.h"

#include "shader/DoricStackNode.h"

class DORIC_EXPORT DoricDraggableNode : public DoricStackNode {

private:
  QString onDragFunction;

public:
  using DoricStackNode::DoricStackNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  void onDrag(double x, double y);
};

#endif // DORICDRAGGABLENODE_H
