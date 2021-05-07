#include <QJSValueIterator>

#include "DoricSuperNode.h"

void DoricSuperNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "subviews") {
    if (prop.isArray()) {
      QJsonArray array = prop.toArray();
      const int length = array.size();
      for (int i = 0; i < length; ++i) {
        QJsonValue subNode = array.at(i);
        mixinSubNode(subNode);
        blendSubNode(subNode);
      }
    }
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}

void DoricSuperNode::mixinSubNode(QJsonValue subNode) {
  QString id = subNode["id"].toString();
  QList<QString> keys = subNodes.keys();
  if (!keys.contains(id)) {
    subNodes.insert(id, subNode);
  } else {
    mixin(subNode, subNodes.value(id));
  }
}

void DoricSuperNode::mixin(QJsonValue src, QJsonValue target) {
  QJsonValue srcProps = src["props"];
  QJsonValue targetProps = target["props"];

  foreach (const QString &key, srcProps.toObject().keys()) {
    QJsonValue value = srcProps[key];
    if (key == "subviews" && value.isArray()) {

    } else {
      targetProps.toObject().insert(key, value);
    }
  }
}

QJsonValue DoricSuperNode::getSubModel(QString id) {
  if (subNodes.keys().contains(id)) {
    return subNodes.value(id);
  } else {
    return QJsonValue::Undefined;
  }
}

void DoricSuperNode::blendSubLayoutConfig(DoricViewNode *viewNode,
                                          QJsonValue jsValue) {
  viewNode->blendLayoutConfig(jsValue);
}

bool DoricSuperNode::viewIdIsEqual(QJsonValue src, QJsonValue target) {
  QString srcId = src["id"].toString();
  QString targetId = target["id"].toString();
  return srcId == targetId;
}

void DoricSuperNode::recursiveMixin(QJsonValue src, QJsonValue target) {
  QJsonObject srcProps = src["props"].toObject();
  QJsonObject targetProps = target["props"].toObject();
  QJsonValue oriSubviews = targetProps["subviews"];
  for (QString key : srcProps.keys()) {
    QJsonValue jsValue = srcProps[key];
    if ("subviews" == key && jsValue.isArray()) {
      QJsonArray subviews = jsValue.toArray();
      for (QJsonValue subview : subviews) {
        if (oriSubviews.isArray()) {
          for (QJsonValue targetSubview : oriSubviews.toArray()) {
            if (viewIdIsEqual(subview, targetSubview)) {
              recursiveMixin(subview, targetSubview);
              break;
            }
          }
        }
      }
      continue;
    }
    targetProps.insert(key, jsValue);
  }
}
