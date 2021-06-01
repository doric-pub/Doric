#include "DoricSliderBridge.h"
#include "shader/slider/DoricSliderNode.h"

DoricSliderBridge::DoricSliderBridge(QObject *parent) : QObject(parent) {}

void DoricSliderBridge::onPageSlided(QString pointer) {
  QObject *object = (QObject *)(pointer.toULongLong());
  DoricSliderNode *sliderNode = dynamic_cast<DoricSliderNode *>(object);

  sliderNode->onPageSlided();
}
