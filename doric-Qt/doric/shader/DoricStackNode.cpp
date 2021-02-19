#include "DoricStackNode.h"

QQuickItem *DoricStackNode::build() {
  QQmlComponent component;

  const QUrl url(QStringLiteral("qrc:/stack.qml"));
  component.loadUrl(url);

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  return item;
}

void DoricStackNode::blendLayoutConfig() { DoricViewNode::blendLayoutConfig(); }
