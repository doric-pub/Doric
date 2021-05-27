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
    checkByCodeToggle = true;
    view->setProperty("checked", prop.toBool());
    checkByCodeToggle = false;
  } else if (name == "onSwitch") {

  } else if (name == "offTintColor") {
    view->setProperty(
        "offTintColor",
        QVariant::fromValue(DoricUtils::doricColor(prop.toInt())));
  } else if (name == "onTintColor") {
    view->setProperty("onTintColor", QVariant::fromValue(
                                         DoricUtils::doricColor(prop.toInt())));
  } else if (name == "thumbTintColor") {
    view->setProperty(
        "thumbTintColor",
        QVariant::fromValue(DoricUtils::doricColor(prop.toInt())));
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
