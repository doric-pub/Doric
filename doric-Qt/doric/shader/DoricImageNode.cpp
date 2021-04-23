#include "DoricImageNode.h"
#include "DoricSuperNode.h"

#include "../utils/DoricUtils.h"

#include <QQuickItem>

QQuickItem *DoricImageNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/image.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricImageNode::blend(QJsonValue jsValue) {
  if (jsValue.toObject().contains("scaleType"))
    this->contentMode = jsValue["scaleType"].toInt();
  if (jsValue.toObject().contains("placeHolderColor"))
    this->placeHolderColor = jsValue["placeHolderColor"].toInt();
  if (jsValue.toObject().contains("errorColor"))
    this->errorColor = jsValue["errorColor"].toInt();
  if (jsValue.toObject().contains("loadCallback"))
    this->loadCallbackId = jsValue["loadCallback"].toString();

  DoricViewNode::blend(jsValue);
}

void DoricImageNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  QQuickItem *container = view;
  if (name == "imageUrl") {
    container->setProperty("fillMode", this->contentMode);
    container->setProperty("source", prop.toString());
  } else if (name == "imageBase64") {
    container->setProperty("fillMode", this->contentMode);
    container->setProperty("source", prop.toString());
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}

void DoricImageNode::onReady() {
  if (!this->loadCallbackId.isEmpty()) {
    QVariantList args;

    QMap<QString, QVariant> map;
    map.insert("width", 0);
    map.insert("height", 0);

    args.append(QVariant::fromValue(map));
    this->callJSResponse(this->loadCallbackId, args);
  }

  DoricSuperNode *node = this->mSuperNode;
  while (node->mSuperNode != nullptr) {
    node = node->mSuperNode;
  }
  node->requestLayout();
}

void DoricImageNode::onError() {
  if (!this->loadCallbackId.isEmpty()) {
    QVariantList args;
    this->callJSResponse(this->loadCallbackId, args);
  }
}
