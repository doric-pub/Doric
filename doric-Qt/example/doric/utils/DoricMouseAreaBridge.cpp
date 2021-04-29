#include "DoricMouseAreaBridge.h"
#include "shader/DoricViewNode.h"

DoricMouseAreaBridge::DoricMouseAreaBridge(QObject *parent) : QObject(parent) {}

void DoricMouseAreaBridge::onClick(QString pointer) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricViewNode *viewNode = dynamic_cast<DoricViewNode *>(object);
  viewNode->onClick();
}
