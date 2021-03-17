#include "DoricHLayoutNode.h"

QQuickItem *DoricHLayoutNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/hlayout.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  return item;
}

void DoricHLayoutNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "space") {
    view->childItems().at(0)->setProperty("spacing", prop.toInt());
  } else if (name == "gravity") {
    view->childItems().at(0)->setProperty("gravity", prop.toInt());
  } else {
    DoricGroupNode::blend(view, name, prop);
  }
}
