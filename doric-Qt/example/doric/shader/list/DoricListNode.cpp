#include "DoricListNode.h"

QQuickItem *DoricListNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/list.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

DoricViewNode *DoricListNode::getSubNodeById(QString id) {}

void DoricListNode::blendSubNode(QJsonValue subProperties) {}

void DoricListNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "itemCount") {
    this->itemCount = prop.toInt();
  } else {
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricListNode::afterBlended(QJsonValue prop) {
  mView->setProperty("model", this->itemCount);
}

// adapter method
void DoricListNode::bind(QVariant rectangle, int position) {
  listAdapter.bind(rectangle, position);
}
