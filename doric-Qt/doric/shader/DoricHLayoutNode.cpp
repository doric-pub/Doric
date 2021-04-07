#include "DoricHLayoutNode.h"

QQuickItem *DoricHLayoutNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/hlayout.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricHLayoutNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  QQuickItem *container = view->childItems().at(1);
  if (name == "space") {
    container->setProperty("spacing", prop.toInt());
  } else if (name == "gravity") {
    container->setProperty("gravity", prop.toInt());
  } else {
    DoricGroupNode::blend(view, name, prop);
  }
}
