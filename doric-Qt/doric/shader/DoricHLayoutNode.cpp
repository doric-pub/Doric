#include "DoricHLayoutNode.h"

QQuickItem *DoricHLayoutNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/hlayout.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  return item;
}

void DoricHLayoutNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "space") {
    view->setProperty("spacing", prop.toInt());
  } else if (name == "gravity") {
    switch (prop.toInt()) {
    case 1:
      view->setProperty("alignItems", "center");
      break;
    }
  } else {
    DoricGroupNode::blend(view, name, prop);
  }
}
