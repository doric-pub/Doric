#include "DoricViewNode.h"
#include "../utils/DoricConstant.h"
#include "../utils/DoricUtils.h"
#include "DoricSuperNode.h"

void DoricViewNode::blendLayoutConfig(QJsonValue jsObject) {
  this->mLayoutConfig = jsObject;

  QJsonValue margin = jsObject["margin"];
  QJsonValue widthSpec = jsObject["widthSpec"];
  QJsonValue heightSpec = jsObject["heightSpec"];

  if (widthSpec.isDouble()) {
    switch (widthSpec.toInt()) {
    case SpecMode::JUST:
      mView->setProperty("widthSpec", SpecMode::JUST);
      break;
    case SpecMode::FIT:
      mView->setProperty("widthSpec", SpecMode::FIT);
      break;
    case SpecMode::MOST:
      mView->setProperty("widthSpec", SpecMode::MOST);
      break;
    }
  }

  if (heightSpec.isDouble()) {
    switch (heightSpec.toInt()) {
    case SpecMode::JUST:
      mView->setProperty("heightSpec", SpecMode::JUST);
      break;
    case SpecMode::FIT:
      mView->setProperty("heightSpec", SpecMode::FIT);
      break;
    case SpecMode::MOST:
      mView->setProperty("heightSpec", SpecMode::MOST);
      break;
    }
  }
}

void DoricViewNode::setLayoutConfig(QJsonValue layoutConfig) {
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
  this->mLayoutConfig = superNode->generateDefaultLayoutConfig();
  this->mView = build();
}

QString DoricViewNode::getId() { return mId; }

void DoricViewNode::setId(QString id) { mId = id; }

QString DoricViewNode::getType() { return mType; }

QQuickItem *DoricViewNode::getNodeView() { return mView; }

void DoricViewNode::blend(QJsonValue jsValue) {
  QJsonValue value = jsValue["layoutConfig"];
  if (value.isObject()) {
    setLayoutConfig(value);
  }

  foreach (const QString &key, jsValue.toObject().keys()) {
    QJsonValue value = jsValue[key];
    blend(mView, key, value);
  }
}

void DoricViewNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "width") {
    if (!prop.isDouble()) {
      return;
    }
    if (this->mLayoutConfig.isUndefined()) {
      view->setWidth(prop.toInt());
    } else {
      QJsonValue widthSpec = this->mLayoutConfig["widthSpec"];
      if (widthSpec.isDouble()) {
        if (widthSpec.toInt() == SpecMode::JUST) {
          view->setWidth(prop.toInt());
        }
      }
    }
  } else if (name == "height") {
    if (!prop.isDouble()) {
      return;
    }
    if (this->mLayoutConfig.isUndefined()) {
      view->setHeight(prop.toInt());
    } else {
      QJsonValue heightSpec = this->mLayoutConfig["heightSpec"];
      if (heightSpec.isDouble()) {
        if (heightSpec.toInt() == SpecMode::JUST) {
          view->setHeight(prop.toInt());
        }
      }
    }
  } else if (name == "backgroundColor") {
    QString color = DoricUtils::doricColor(prop.toInt()).name();
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
