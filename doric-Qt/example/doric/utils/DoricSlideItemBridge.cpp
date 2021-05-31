#include "DoricSlideItemBridge.h"

#include "shader/slider/DoricSlideItemNode.h"

DoricSlideItemBridge::DoricSlideItemBridge(QObject *parent) : QObject(parent) {}

void DoricSlideItemBridge::apply(QString pointer) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricSlideItemNode *slideItemNode =
      dynamic_cast<DoricSlideItemNode *>(object);

  slideItemNode->apply();
}
