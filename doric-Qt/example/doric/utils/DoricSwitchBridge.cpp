#include "DoricSwitchBridge.h"

#include "shader/DoricSwitchNode.h"

DoricSwitchBridge::DoricSwitchBridge(QObject *parent) : QObject(parent) {}

void DoricSwitchBridge::onSwitch(QString pointer, bool checked) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricSwitchNode *switchNode = dynamic_cast<DoricSwitchNode *>(object);

  switchNode->onSwitch(checked);
}
