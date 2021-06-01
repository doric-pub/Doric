#include "DoricSliderNode.h"

#include <QJsonDocument>

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

DoricViewNode *DoricSliderNode::getSubNodeById(QString id) {
  for (int i = 0; i != childNodes.size(); i++) {
    if (childNodes.at(i)->getId() == id) {
      return childNodes.at(i);
    }
  }
  return nullptr;
}

void DoricSliderNode::blendSubNode(QJsonValue subProperties) {
  QString viewId = subProperties["id"].toString();
  DoricViewNode *node = getSubNodeById(viewId);
  if (node != nullptr) {
    node->blend(subProperties["props"]);
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
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricSliderNode::afterBlended(QJsonValue prop) {
  if (this->childNodes.length() != this->itemCount) {
    QVariantList args;
    args.append(this->childNodes.length());
    args.append(this->itemCount);
    std::shared_ptr<DoricAsyncResult> asyncResult =
        this->pureCallJSResponse("renderBunchedItems", args);
    QString jsValueString = asyncResult->waitUntilResult();

    QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
    QJsonArray jsValue = document.array();

    QQmlListProperty<QQuickItem> contentChildren =
        qvariant_cast<QQmlListProperty<QQuickItem>>(
            mView->property("contentChildren"));

    for (int i = 0; i != jsValue.size(); i++) {
      QJsonValue model = jsValue.at(i);
      QString id = model["id"].toString();
      QString type = model["type"].toString();
      DoricViewNode *newNode = DoricViewNode::create(getContext(), type);
      if (newNode != nullptr) {
        newNode->setId(id);
        newNode->init(this);

        this->childNodes.append((DoricSlideItemNode *)newNode);
        contentChildren.append(&contentChildren, newNode->getNodeView());

        newNode->blend(model["props"]);
      }
    }
  }
}
