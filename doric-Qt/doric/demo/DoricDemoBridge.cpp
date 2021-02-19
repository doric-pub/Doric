#include <QDebug>
#include <QQuickView>

#include "DoricDemoBridge.h"
#include "DoricPanel.h"
#include "utils/DoricUtils.h"

DoricDemoBridge::DoricDemoBridge(QObject *parent) : QObject(parent) {}

void DoricDemoBridge::navigate(QVariant route) {
  switch (route.toInt()) {
  case 0:
    QString name = "Snake.es5.js";
    QString script = DoricUtils::readAssetFile("/doric/bundles", name);

    QQuickView *view = new QQuickView();
    view->setWidth(450);
    view->setHeight(800);
    QColor blue("blue");
    view->setColor(blue);
    view->show();

    DoricPanel *panel = new DoricPanel();
    panel->setParent(view);
    panel->setWidth(450);
    panel->setHeight(800);
    panel->config(script, name, NULL);
    break;
  }
}
