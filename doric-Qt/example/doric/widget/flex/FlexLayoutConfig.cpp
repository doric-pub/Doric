#include "FlexLayoutConfig.h"

FlexLayoutConfig::FlexLayoutConfig(QObject *parent) : QObject(parent) {
  config = YGConfigNew();
}

FlexLayoutConfig::~FlexLayoutConfig() { YGConfigFree(config); }

YGConfigRef FlexLayoutConfig::getConfig() const { return config; }
