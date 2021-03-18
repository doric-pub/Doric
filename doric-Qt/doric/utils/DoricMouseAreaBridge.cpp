#include "DoricMouseAreaBridge.h"

DoricMouseAreaBridge::DoricMouseAreaBridge(QObject *parent) : QObject(parent) {}

void DoricMouseAreaBridge::onClick(QVariant functionId) {
  qCritical() << functionId;
}
