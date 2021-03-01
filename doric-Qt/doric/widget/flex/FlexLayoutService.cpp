#include "FlexLayoutService.h"

FlexLayoutService::FlexLayoutService(QObject *parent) : QObject(parent) {
  config = new FlexLayoutConfig(this);
}

FlexLayoutService::~FlexLayoutService() {}

QVariant FlexLayoutService::createNode(QVariant config) {
  FlexLayoutConfig *object = qvariant_cast<FlexLayoutConfig *>(config);
  QVariant result;
  if (object == nullptr) {
    qCritical() << "FlexLayoutService createNode config not FlexLayoutConfig*";
  } else {
    result = QVariant::fromValue(new FlexLayout(object, this));
  }
  return result;
}

void FlexLayoutService::collectGarbage(QVariant rootNode) {
  FlexLayout *node = qvariant_cast<FlexLayout *>(rootNode);
  if (node == nullptr) {
    qCritical() << "FlexLayoutService collectGarbage node to FlexLayout*";
  } else {
    node->deleteLater();
  }
}

QVariant FlexLayoutService::createConfig() {
  return QVariant::fromValue(new FlexLayoutConfig(this));
}

QVariant FlexLayoutService::createNode() {
  return QVariant::fromValue(new FlexLayout(config, this));
}
