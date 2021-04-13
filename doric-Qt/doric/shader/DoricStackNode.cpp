#include "DoricStackNode.h"

QQuickItem *DoricStackNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/stack.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  getLayouts()->setLayoutType(DoricLayoutType::DoricStack);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricStackNode::blendLayoutConfig(QJsonValue jsValue) {
  DoricViewNode::blendLayoutConfig(jsValue);
  QJsonValue maxWidth = jsValue["maxWidth"];
  if (maxWidth.isDouble()) {
  }
  QJsonValue maxHeight = jsValue["maxHeight"];
  if (maxHeight.isDouble()) {
  }
}
