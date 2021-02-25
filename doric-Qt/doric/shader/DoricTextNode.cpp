#include "DoricTextNode.h"

QQuickItem *DoricTextNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/text.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  return item;
}

void DoricTextNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "text") {
    view->setProperty("text", prop.toString());
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
