#include "DoricListBridge.h"
#include "shader/list/DoricListNode.h"

DoricListBridge::DoricListBridge(QObject *parent) : QObject(parent) {}

void DoricListBridge::bind(QString pointer, QVariant rectangle, int position) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricListNode *listNode = dynamic_cast<DoricListNode *>(object);
  listNode->bind(rectangle, position);
}
