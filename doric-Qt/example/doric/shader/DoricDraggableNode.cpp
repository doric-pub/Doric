#include "DoricDraggableNode.h"

QQuickItem *DoricDraggableNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/draggable.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricDraggableNode::blend(QQuickItem *view, QString name,
                               QJsonValue prop) {
  if (name == "onDrag") {
    onDrag = prop.toString();
  } else {
    DoricStackNode::blend(view, name, prop);
  }
}
