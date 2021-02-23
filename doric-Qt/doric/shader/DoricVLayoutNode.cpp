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
