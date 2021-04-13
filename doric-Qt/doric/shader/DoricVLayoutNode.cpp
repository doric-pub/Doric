#include "DoricVLayoutNode.h"

QQuickItem *DoricVLayoutNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/vlayout.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  getLayouts()->setLayoutType(DoricLayoutType::DoricVLayout);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricVLayoutNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  QQuickItem *container = view;
  if (name == "space") {
    getLayouts()->setSpacing(prop.toInt());
  } else if (name == "gravity") {
    getLayouts()->setGravity(prop.toInt());
  } else {
    DoricGroupNode::blend(view, name, prop);
  }
}
