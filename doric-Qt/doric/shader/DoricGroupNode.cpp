#include "DoricGroupNode.h"

void DoricGroupNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "children") {
    mChildViewIds.clear();
    if (prop.isArray()) {
      const int length = prop.property("length").toInt();
      for (int i = 0; i < length; ++i) {
        QJSValue value = prop.property(i);
        if (value.isString()) {
          mChildViewIds.append(value.toString());
        }
      }
    }
  } else {
    qCritical() << "group node blend";
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricGroupNode::blend(QJSValue jsValue) {
  DoricViewNode::blend(jsValue);
  configChildNode();
}

void DoricGroupNode::configChildNode() {
  for (int idx = 0; idx < mChildViewIds.size(); idx++) {
    QString id = mChildViewIds.at(idx);
    QJSValue model = getSubModel(id);
    if (model.isUndefined()) {
//      getContext()->getDriver()->getRegistry();
      continue;
    }
    QString type = model.property("type").toString();
    if (idx < mChildNodes.size()) {
      DoricViewNode *oldNode = mChildNodes.at(idx);
      if (id == oldNode->getId()) {
        // The same, skip
        if (mReusable) {
        } else {
        }
      }
    } else {
      // Insert
    }
  }
}

void DoricGroupNode::blendSubNode(QJSValue subProperties) {
  QString subNodeId = subProperties.property("id").toString();
  for (DoricViewNode *node : mChildNodes) {
    if (subNodeId == node->getId()) {
      node->blend(subProperties.property("props"));
      break;
    }
  }
}
