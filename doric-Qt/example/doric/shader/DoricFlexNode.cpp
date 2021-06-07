#include "DoricFlexNode.h"

QQuickItem *DoricFlexNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/flex.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricFlexNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "flexConfig") {

  } else {
    DoricGroupNode::blend(view, name, prop);
  }
}

void DoricFlexNode::blendSubNode(DoricViewNode *subNode,
                                 QJsonValue flexConfig) {
  qDebug() << "blendSubNode";
}

void DoricFlexNode::blendYoga(YGLayout *yoga, QJsonValue flexConfig) {
  qDebug() << "blendYoga";
}

void DoricFlexNode::blendYoga(YGLayout *yoga, QString name, QJsonValue prop) {
  qDebug() << "blendYoga";
}
