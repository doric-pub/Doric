#include <QJSValueIterator>

#include "../utils/DoricUtils.h"
#include "DoricSuperNode.h"
#include "DoricViewNode.h"

void DoricViewNode::blendLayoutConfig(QJSValue jsObject) {
  QJSValue margin = jsObject.property("margin");
  QJSValue widthSpec = jsObject.property("widthSpec");
  QJSValue heightSpec = jsObject.property("heightSpec");

  if (widthSpec.isNumber()) {
    switch (widthSpec.toInt()) {
    case 1:
      qCritical() << 1;
      break;
    case 2:
      qCritical() << 2;
      break;
    default:
      qCritical() << "default";
      break;
    }
  }

  if (heightSpec.isNumber()) {
    switch (heightSpec.toInt()) {
    case 1:
      qCritical() << 1;
      break;
    case 2:
      qCritical() << 2;
      break;
    default:
      qCritical() << "default";
      break;
    }
  }
}

void DoricViewNode::setLayoutConfig(QJSValue layoutConfig) {
  if (mSuperNode != nullptr) {
    mSuperNode->blendSubLayoutConfig(this, layoutConfig);
  } else {
    blendLayoutConfig(layoutConfig);
  }
}

void DoricViewNode::init(DoricSuperNode *superNode) {
  if (DoricUtils:: instanceof <DoricSuperNode *>(this)) {
    DoricSuperNode *thiz = dynamic_cast<DoricSuperNode *>(this);
    thiz->mReusable = superNode->mReusable;
  }
  this->mSuperNode = superNode;
  this->mView = build();
}

QString DoricViewNode::getId() { return mId; }

void DoricViewNode::setId(QString id) { mId = id; }

QString DoricViewNode::getType() { return mType; }

QQuickItem *DoricViewNode::getNodeView() { return mView; }

void DoricViewNode::blend(QJSValue jsValue) {
  QJSValue value = jsValue.property("layoutConfig");
  if (value.isObject()) {
    setLayoutConfig(value);
  }
  QJSValueIterator it(jsValue);
  while (it.hasNext()) {
    it.next();
    blend(mView, it.name(), it.value());
  }
}

void DoricViewNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "width") {
    if (!prop.isNumber()) {
      return;
    }
    view->setWidth(prop.toInt());
  } else if (name == "height") {
    if (!prop.isNumber()) {
      return;
    }
    view->setHeight(prop.toInt());
  } else if (name == "backgroundColor") {
    QString color = DoricUtils::doricColor(prop.toNumber()).name();
    view->setProperty("color", color);
  } else if (name == "x") {
    view->setProperty("x", prop.toInt());
  } else if (name == "y") {
    view->setProperty("y", prop.toInt());
  } else if (name == "corners") {
    view->setProperty("radius", prop.toInt());
  } else {
    qCritical() << name << ": " << prop.toString();
  }
}
