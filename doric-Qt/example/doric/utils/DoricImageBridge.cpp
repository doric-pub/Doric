#include "DoricImageBridge.h"
#include "shader/DoricImageNode.h"

DoricImageBridge::DoricImageBridge(QObject *parent) : QObject(parent) {}

void DoricImageBridge::onNull(QString pointer) {}

void DoricImageBridge::onReady(QString pointer) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricImageNode *imageNode = dynamic_cast<DoricImageNode *>(object);
  imageNode->onReady();
}

void DoricImageBridge::onLoading(QString pointer) {}

void DoricImageBridge::onError(QString pointer) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricImageNode *imageNode = dynamic_cast<DoricImageNode *>(object);
  imageNode->onError();
}
