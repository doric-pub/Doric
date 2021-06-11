#include "DoricListItemNode.h"

QQuickItem *DoricListItemNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/list-item.qml"));
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

void DoricListItemNode::apply() { getLayouts()->apply(); }
