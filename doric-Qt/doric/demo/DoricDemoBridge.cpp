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

    DoricPanel *panel = new DoricPanel();
    panel->setParentItem(view->rootObject());
    panel->setWidth(450);
    panel->setHeight(800);
    panel->config(script, name, NULL);

    QQmlEngine *engine = view->engine();
    QQmlComponent component(engine);
    const QUrl empty(QStringLiteral("qrc:/doric/qml/panel.qml"));
    component.loadUrl(empty);
    QQuickItem *childItem = qobject_cast<QQuickItem *>(component.create());

    if (childItem == nullptr) {
      qCritical() << component.errorString();
      return;
    }
    childItem->setParentItem(view->rootObject());

    view->show();
    break;
  }
}
