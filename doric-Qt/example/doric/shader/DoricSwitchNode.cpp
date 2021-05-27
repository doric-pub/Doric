#include "DoricSwitchNode.h"

#include "../utils/DoricUtils.h"

QQuickItem *DoricSwitchNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/switch.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricSwitchNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "state") {

  } else if (name == "onSwitch") {

  } else if (name == "offTintColor") {

  } else if (name == "onTintColor") {

  } else if (name == "thumbTintColor") {

  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
