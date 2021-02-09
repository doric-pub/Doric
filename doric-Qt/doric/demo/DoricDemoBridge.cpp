#include <QDebug>
#include <QQuickItem>
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
    view->setWidth(960);
    view->setHeight(720);
    QColor color("blue");
    view->setColor(color);
    view->show();

    view->rootObject();

    DoricPanel *panel = new DoricPanel();
    panel->config(script, name, NULL);
    break;
  }
}
