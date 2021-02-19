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
    {
      const QUrl url(QStringLiteral("qrc:/doric/qml/view.qml"));
      view->setSource(url);
      view->setWidth(450);
      view->setHeight(800);
    }

    {
      QQmlComponent component(view->engine());
      const QUrl url(QStringLiteral("qrc:/doric/qml/panel.qml"));
      component.loadUrl(url);
      QQuickItem *quickItem = qobject_cast<QQuickItem *>(component.create());
      DoricPanel *panel = new DoricPanel(quickItem);
      quickItem->setWidth(450);
      quickItem->setHeight(800);
      quickItem->setParentItem(view->rootObject());

      panel->config(script, name, NULL);
    }

    view->show();
    break;
  }
}
