#include "DoricInputBridge.h"

#include "shader/DoricInputNode.h"

DoricInputBridge::DoricInputBridge(QObject *parent) : QObject(parent) {}

void DoricInputBridge::onTextChange(QString pointer, QString text) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricInputNode *inputNode = dynamic_cast<DoricInputNode *>(object);

  inputNode->onTextChange(text);
}

void DoricInputBridge::onFocusChange(QString pointer) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricInputNode *inputNode = dynamic_cast<DoricInputNode *>(object);
}
