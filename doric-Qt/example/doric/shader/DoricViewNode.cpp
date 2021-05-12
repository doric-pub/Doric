#include "DoricViewNode.h"
#include "../utils/DoricConstant.h"
#include "../utils/DoricUtils.h"
#include "DoricSuperNode.h"

void DoricViewNode::blendLayoutConfig(QJsonValue jsValue) {
  QJsonObject jsObject = jsValue.toObject();
  if (jsObject.contains("widthSpec"))
    getLayouts()->setWidthSpec(jsObject["widthSpec"].toInt());

  if (jsObject.contains("heightSpec"))
    getLayouts()->setHeightSpec(jsObject["heightSpec"].toInt());

  if (jsObject.contains("margin")) {
    QJsonObject margin = jsObject["margin"].toObject();

    if (margin.contains("left"))
      getLayouts()->setMarginLeft(margin["left"].toDouble());

    if (margin.contains("top"))
      getLayouts()->setMarginTop(margin["top"].toDouble());

    if (margin.contains("right"))
      getLayouts()->setMarginRight(margin["right"].toDouble());

    if (margin.contains("bottom"))
      getLayouts()->setMarginBottom(margin["bottom"].toDouble());
  }

  if (jsObject.contains("alignment"))
    getLayouts()->setAlignment(jsObject["alignment"].toInt());

  if (jsObject.contains("weight"))
    getLayouts()->setWeight(jsObject["weight"].toInt());

  if (jsObject.contains("maxWidth"))
    getLayouts()->setMaxWidth(jsObject["maxWidth"].toDouble());

  if (jsObject.contains("maxHeight"))
    getLayouts()->setMaxHeight(jsObject["maxHeight"].toDouble());

  if (jsObject.contains("minWidth"))
    getLayouts()->setMinWidth(jsObject["minWidth"].toDouble());

  if (jsObject.contains("minHeight"))
    getLayouts()->setMinHeight(jsObject["minHeight"].toDouble());
}

void DoricViewNode::createLayouts(QQuickItem *view) {
  if (mLayouts == nullptr) {
    mLayouts = new DoricLayouts();
    mLayouts->setWidth(view->width());
    mLayouts->setHeight(view->height());
    mLayouts->setView(view);

    view->setProperty("doricLayout", QString::number((qint64)mLayouts));
  }
}

DoricLayouts *DoricViewNode::getLayouts() { return mLayouts; }

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
  this->mView = build();
  getLayouts();
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

  this->afterBlended(jsValue);
}

void DoricViewNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "width") {
    getLayouts()->setWidth(prop.toDouble());
  } else if (name == "height") {
    getLayouts()->setHeight(prop.toDouble());
  } else if (name == "backgroundColor") {
    if (prop.isDouble()) {
      view->setProperty("backgroundColorIsObject", false);
      view->setProperty(
          "backgroundColor",
          QVariant::fromValue(DoricUtils::doricColor(prop.toInt())));
    } else if (prop.isObject()) {
      QJsonObject dict = prop.toObject();
      view->setProperty("backgroundColorIsObject", true);

      QJsonValue orientation = prop["orientation"];
      if (orientation.isDouble()) {
        view->setProperty("orientation", orientation.toInt());
      }
      if (dict.keys().contains("colors")) {
        QVector<int> colors;
        QJsonArray colorArray = dict["colors"].toArray();
        for (int i = 0; i != colorArray.size(); i++) {
          colors.append(colorArray.at(i).toInt());
        }

        if (dict.keys().contains("locations")) {
          QJsonValue locationsValue = dict["locations"];
          if (locationsValue.isArray()) {
            QVector<double> locations;
            QJsonArray locationArray = locationsValue.toArray();
            for (int i = 0; i != locationArray.size(); i++) {
              locations.append(locationArray.at(i).toDouble());
            }
            view->setProperty("gradientLocations",
                              QVariant::fromValue(locations));
          }
        }

        view->setProperty("gradientColors", QVariant::fromValue(colors));
      } else {
        if (dict.keys().contains("start") && dict.keys().contains("end")) {
          int start = dict["start"].toInt();
          int end = dict["end"].toInt();

          QVector<int> colors;
          colors.append(start);
          colors.append(end);

          view->setProperty("gradientColors", QVariant::fromValue(colors));
        }
      }
    }
  } else if (name == "x") {
    getLayouts()->setMarginLeft(prop.toDouble());
  } else if (name == "y") {
    getLayouts()->setMarginTop(prop.toDouble());
  } else if (name == "corners") {
    if (prop.isDouble()) {
      view->setProperty("radius", prop.toDouble());
    } else if (prop.isObject()) {
      view->setProperty("radiusLeftTop", prop["leftTop"].toDouble());
      view->setProperty("radiusRightTop", prop["rightTop"].toDouble());
      view->setProperty("radiusLeftBottom", prop["leftBottom"].toDouble());
      view->setProperty("radiusRightBottom", prop["rightBottom"].toDouble());
    }
  } else if (name == "onClick") {
    if (prop.isString())
      clickFunction = prop.toString();
  } else if (name == "padding") {
    getLayouts()->setPaddingLeft(prop["left"].toDouble());
    getLayouts()->setPaddingRight(prop["right"].toDouble());
    getLayouts()->setPaddingTop(prop["top"].toDouble());
    getLayouts()->setPaddingBottom(prop["bottom"].toDouble());
  } else if (name == "hidden") {
    getLayouts()->setDisabled(prop.toBool());
  } else if (name == "border") {
    qreal borderWidth = prop["width"].toDouble();
    QString borderColor = DoricUtils::doricColor(prop["color"].toInt()).name();
    view->setProperty("borderWidth", borderWidth);
    view->setProperty("borderColor", borderColor);
  } else if (name == "shadow") {
    view->setProperty("shadowColor", QVariant::fromValue(DoricUtils::doricColor(
                                         prop["color"].toInt())));
    view->setProperty("shadowRadius", prop["radius"].toDouble());
    view->setProperty("shadowOffsetX", prop["offsetX"].toDouble());
    view->setProperty("shadowOffsetY", prop["offsetY"].toDouble());
    view->setProperty("shadowOpacity", prop["opacity"].toDouble());
  } else if (name != "layoutConfig") {
    qCritical() << name << ": " << prop.toString();
  }
}

void DoricViewNode::afterBlended(QJsonValue prop) {}

QList<QString> DoricViewNode::getIdList() {
  QList<QString> ids;

  DoricViewNode *viewNode = this;
  do {
    ids.insert(0, viewNode->mId);
    viewNode = viewNode->mSuperNode;
  } while (viewNode != nullptr);

  return ids;
}

void DoricViewNode::requestLayout() {}

std::shared_ptr<DoricAsyncResult>
DoricViewNode::callJSResponse(QString funcId, QVariantList args) {
  QVariantList nArgs;
  QList<QString> idList = getIdList();
  nArgs.append(QVariant(idList));
  nArgs.append(funcId);
  foreach (const QVariant &arg, args)
    nArgs.append(arg);

  return getContext()->callEntity(DoricConstant::DORIC_ENTITY_RESPONSE, nArgs);
}

std::shared_ptr<DoricAsyncResult>
DoricViewNode::pureCallJSResponse(QString funcId, QVariantList args) {
  QVariantList nArgs;
  nArgs.append(getContext()->getContextId());
  nArgs.append(DoricConstant::DORIC_ENTITY_RESPONSE);
  QList<QString> idList = getIdList();
  nArgs.append(QVariant(idList));
  nArgs.append(funcId);
  foreach (const QVariant &arg, args)
    nArgs.append(arg);

  return getContext()->callEntity(DoricConstant::DORIC_CONTEXT_INVOKE_PURE,
                                  nArgs);
}

void DoricViewNode::onClick() {
  if (clickFunction.isEmpty()) {
    return;
  }
  QVariantList args;
  callJSResponse(clickFunction, args);
}
