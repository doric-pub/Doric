#include "DoricGroupNode.h"

void DoricGroupNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "children") {
    mChildViewIds.clear();
    if (prop.isArray()) {
        qDebug() << prop.toString();
    }
  } else {
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricGroupNode::blend(QJSValue jsValue) {
  DoricViewNode::blend(jsValue);
  configChildNode();
}

void DoricGroupNode::configChildNode() {}
