#include "DoricStackNode.h"

QQmlComponent *DoricStackNode::build() {
  QQmlComponent *component = new QQmlComponent();

  const QUrl url(QStringLiteral("qrc:/stack.qml"));
  component->loadUrl(url);

  return component;
}

void DoricStackNode::blendLayoutConfig() {
    DoricViewNode::blendLayoutConfig();
}
