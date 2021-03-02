#include <QJSValueIterator>

#include "DoricSuperNode.h"

void DoricSuperNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "subviews") {
    if (prop.isArray()) {
      const int length = prop.property("length").toInt();
      for (int i = 0; i < length; ++i) {
        QJSValue subNode = prop.property(i);
        mixinSubNode(subNode);
        blendSubNode(subNode);
      }
    }
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}

void DoricSuperNode::mixinSubNode(QJSValue subNode) {
  QString id = subNode.property("id").toString();
  QList<QString> keys = subNodes.keys();
  if (!keys.contains(id)) {
    subNodes.insert(id, subNode);
  } else {
    mixin(subNode, subNodes.value(id));
  }
}

void DoricSuperNode::mixin(QJSValue src, QJSValue target) {
  QJSValue srcProps = src.property("props");
  QJSValue targetProps = target.property("props");
  QJSValueIterator it(srcProps);
  while (it.hasNext()) {
    it.next();

    if (it.name() == "subviews" && it.value().isArray()) {

    } else {
      targetProps.setProperty(it.name(), it.value());
    }
  }
}

QJSValue DoricSuperNode::getSubModel(QString id) {
  if (subNodes.keys().contains(id)) {
    return subNodes.value(id);
  } else {
    return QJSValue::UndefinedValue;
  }
}

void DoricSuperNode::blendSubLayoutConfig(DoricViewNode *viewNode,
                                          QJSValue jsValue) {
  viewNode->blendLayoutConfig(jsValue);
}
