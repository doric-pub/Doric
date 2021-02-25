#include "DoricVLayoutNode.h"

QQuickItem *DoricVLayoutNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/vlayout.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  return item;
}

void DoricVLayoutNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "space") {
    view->setProperty("spacing", prop.toInt());
  } else if (name == "gravity") {
    qWarning() << "gravity: " << prop.toInt();
    switch (prop.toInt()) {
    case 1:
      break;
    }
  } else {
    DoricGroupNode::blend(view, name, prop);
  }
}
