#include <QDebug>

#include "DoricDemoBridge.h"
#include "DoricPanel.h"
#include "utils/DoricUtils.h"

DoricDemoBridge::DoricDemoBridge(QObject *parent) : QObject(parent) {}

void DoricDemoBridge::navigate(QVariant route) {
  switch (route.toInt()) {
  case 0:
    QString name = "Snake.es5.js";
    QString script = DoricUtils::readAssetFile("/doric/bundles", name);

    DoricPanel panel;
    panel.config(script, name, NULL);
    break;
  }
}
