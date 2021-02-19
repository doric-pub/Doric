#include "DoricSuperNode.h"

void DoricSuperNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "subviews") {
    if (prop.isArray()) {
      qDebug() << prop.toString();
    }
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
