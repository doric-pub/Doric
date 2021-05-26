#include "DoricInputNode.h"

QQuickItem *DoricInputNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/input.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricInputNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "hintText") {
    view->setProperty("placeholderText", prop.toString());
  } else if (name == "textAlignment") {
    view->setProperty("textAlignment", prop.toInt());
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
