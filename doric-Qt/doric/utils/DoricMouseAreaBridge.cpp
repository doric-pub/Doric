#include "DoricMouseAreaBridge.h"
#include "shader/DoricViewNode.h"

DoricMouseAreaBridge::DoricMouseAreaBridge(QObject *parent) : QObject(parent) {}

void DoricMouseAreaBridge::onClick(qint64 pointer) {
  QObject *object = (QObject *)(pointer);
  DoricViewNode *viewNode = dynamic_cast<DoricViewNode *>(object);
  qCritical() << viewNode;
}
