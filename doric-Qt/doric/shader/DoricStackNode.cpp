#include "DoricStackNode.h"

QQuickItem *DoricStackNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/stack.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  return item;
}

void DoricStackNode::blendLayoutConfig(QJSValue jsValue) {
  DoricViewNode::blendLayoutConfig(jsValue);
  QJSValue maxWidth = jsValue.property("maxWidth");
  if (maxWidth.isNumber()) {
  }
  QJSValue maxHeight = jsValue.property("maxHeight");
  if (maxHeight.isNumber()) {
  }
}
