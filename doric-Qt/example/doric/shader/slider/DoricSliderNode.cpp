#include "DoricSliderNode.h"

QQuickItem *DoricSliderNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/slider.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

DoricViewNode *DoricSliderNode::getSubNodeById(QString id) { return nullptr; }

void DoricSliderNode::blendSubNode(QJsonValue subProperties) {
  QString viewId = subProperties["id"].toString();
  DoricViewNode *node = getSubNodeById(viewId);
  if (node != nullptr) {
    node->blend(subProperties["props"]);
  } else {
    QJsonValue oldModel = getSubModel(viewId);
    if (oldModel != QJsonValue::Undefined) {
      DoricSuperNode::recursiveMixin(subProperties, oldModel);
    }
  }
}

void DoricSliderNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "itemCount") {
    this->itemCount = prop.toInt();
  } else if (name == "renderPage") {
    if (prop.toString() != this->renderPageFuncId) {
      this->childNodes.clear();
      this->renderPageFuncId = prop.toString();
    }
  } else if (name == "batchCount") {
    this->batchCount = prop.toInt();
  } else if (name == "onPageSlided") {
    this->onPageSelectedFuncId = prop.toString();
  } else if (name == "loop") {
    this->loop = prop.toBool();
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}

void DoricSliderNode::afterBlended(QJsonValue prop) {
  if (this->childNodes.length() != this->itemCount) {
    QVariantList args;
    args.append(this->childNodes.length());
    args.append(this->itemCount);
    std::shared_ptr<DoricAsyncResult> asyncResult =
        this->pureCallJSResponse("renderBunchedItems", args);
    QString result = asyncResult->waitUntilResult();
    qDebug() << result;
  }
}
