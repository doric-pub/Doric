#include <QDebug>
#include <QQmlContext>
#include <QQuickView>

#include "DoricDemoBridge.h"
#include "DoricPanel.h"
#include "utils/DoricUtils.h"
#include "utils/DoricMouseAreaBridge.h"

DoricDemoBridge::DoricDemoBridge(QObject *parent) : QObject(parent) {}

void DoricDemoBridge::navigate(QVariant route) {
  QString name;
  switch (route.toInt()) {
  case 0:
    name = "Counter.js";
    break;
  case 1:
    name = "Gobang.js";
    break;
  case 2:
    name = "SimpleDemo.js";
    break;
  case 3:
    name = "Snake.js";
    break;
  }
  QString script = DoricUtils::readAssetFile("/doric/bundles", name);

  QQuickView *view = new QQuickView();
  {
    const QUrl url(QStringLiteral("qrc:/doric/qml/view.qml"));
    view->setSource(url);
    view->setWidth(405);
    view->setHeight(720);
  }

  {
    QQmlComponent component(view->engine());
    const QUrl url(QStringLiteral("qrc:/doric/qml/panel.qml"));
    component.loadUrl(url);
    QQuickItem *quickItem = qobject_cast<QQuickItem *>(component.create());
    DoricPanel *panel = new DoricPanel(view->engine(), quickItem);
    quickItem->setWidth(405);
    quickItem->setHeight(720);
    quickItem->setParentItem(view->rootObject());

    panel->config(script, name, NULL);
  }

  view->show();

  auto context = view->engine()->rootContext();
  DoricMouseAreaBridge *mouseAreaBridge = new DoricMouseAreaBridge();
  context->setContextProperty("mouseAreaBridge", mouseAreaBridge);
}
