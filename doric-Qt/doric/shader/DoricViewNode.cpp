#include <QJSValueIterator>

#include "../utils/DoricConstant.h"
#include "../utils/DoricUtils.h"
#include "DoricSuperNode.h"
#include "DoricViewNode.h"

void DoricViewNode::blendLayoutConfig(QJSValue jsObject) {
  this->mLayoutConfig = jsObject;

  QJSValue margin = jsObject.property("margin");
  QJSValue widthSpec = jsObject.property("widthSpec");
  QJSValue heightSpec = jsObject.property("heightSpec");

  if (widthSpec.isNumber()) {
    switch (widthSpec.toInt()) {
    case 0:
      mView->setProperty("widthSpec", 0);
      break;
    case 1:
      mView->setProperty("widthSpec", 1);
      break;
    case 2:
      mView->setProperty("widthSpec", 2);
      break;
    }
  }

  if (heightSpec.isNumber()) {
    switch (heightSpec.toInt()) {
    case 0:
      mView->setProperty("heightSpec", 0);
      break;
    case 1:
      mView->setProperty("heightSpec", 1);
      break;
    case 2:
      mView->setProperty("heightSpec", 2);
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
    if (this->mLayoutConfig.isUndefined()) {
      view->setWidth(prop.toInt());
    } else {
      QJSValue widthSpec = this->mLayoutConfig.property("widthSpec");
      if (widthSpec.isNumber()) {
        if (widthSpec.toInt() == 0) {
          view->setWidth(prop.toInt());
        }
      }
    }
  } else if (name == "height") {
    if (!prop.isNumber()) {
      return;
    }
    if (this->mLayoutConfig.isUndefined()) {
      view->setHeight(prop.toInt());
    } else {
      QJSValue heightSpec = this->mLayoutConfig.property("heightSpec");
      if (heightSpec.isNumber()) {
        if (heightSpec.toInt() == 0) {
          view->setHeight(prop.toInt());
        }
      }
    }
  } else if (name == "backgroundColor") {
    QString color = DoricUtils::doricColor(prop.toNumber()).name();
    view->setProperty("color", color);
  } else if (name == "x") {
    view->setProperty("x", prop.toInt());
  } else if (name == "y") {
    view->setProperty("y", prop.toInt());
  } else if (name == "corners") {
    view->setProperty("radius", prop.toInt());
  } else if (name == "onClick") {
    if (prop.isString())
      clickFunction = prop.toString();
  } else {
    qCritical() << name << ": " << prop.toString();
  }
}

QList<QString> DoricViewNode::getIdList() {
  QList<QString> ids;

  DoricViewNode *viewNode = this;
  do {
    ids.append(viewNode->mId);
    viewNode = viewNode->mSuperNode;
  } while (viewNode != nullptr);

  return ids;
}

void DoricViewNode::callJSResponse(QString funcId, QVariantList args) {
  QVariantList nArgs;
  QList<QString> idList = getIdList();
  nArgs.append(idList);
  nArgs.append(funcId);
  foreach (const QVariant &arg, args)
    nArgs.append(arg);

  return getContext()->callEntity(DoricConstant::DORIC_ENTITY_RESPONSE, nArgs);
}

void DoricViewNode::onClick() {
  if (clickFunction.isEmpty()) {
    return;
  }
  QVariantList args;
  callJSResponse(clickFunction, args);
}
