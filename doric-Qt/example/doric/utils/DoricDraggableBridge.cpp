#include "DoricDraggableBridge.h"
#include "shader/DoricDraggableNode.h"

DoricDraggableBridge::DoricDraggableBridge(QObject *parent) : QObject(parent) {}

void DoricDraggableBridge::onDrag(QString pointer, double x, double y) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricDraggableNode *draggableNode =
      dynamic_cast<DoricDraggableNode *>(object);

  draggableNode->onDrag(x, y);
}
