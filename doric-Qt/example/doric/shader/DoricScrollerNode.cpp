#include "DoricScrollerNode.h"

QQuickItem *DoricScrollerNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/scroller.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricScrollerNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "content") {
    if (!prop.isString()) {
      return;
    }
    mChildViewId = prop.toString();
  } else if (name == "onScroll") {
    if (!prop.isString()) {
      return;
    }
    onScrollFuncId = prop.toString();
  } else if (name == "onScrollEnd") {
    if (!prop.isString()) {
      return;
    }
    onScrollEndFuncId = prop.toString();
  } else {
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricScrollerNode::afterBlended(QJsonValue jsValue) {
  QJsonValue contentModel = getSubModel(mChildViewId);
  if (contentModel == QJsonValue::Undefined) {
    return;
  }

  QString viewId = contentModel["id"].toString();
  QString type = contentModel["type"].toString();
  QJsonValue props = contentModel["props"];

  QQuickItem *parent = mView;

  if (mChildNode != nullptr) {
    if (viewId == mChildNode->getId()) {
      // skip
    } else {
      if (mReusable && mChildNode->getType() == type) {
        mChildNode->setId(viewId);
        mChildNode->blend(props);
      } else {
        // remove all views
        for (int i = 0; i != parent->childItems().size(); i++) {
          parent->childItems().at(i)->setParent(nullptr);
          parent->childItems().at(i)->setParentItem(nullptr);
          parent->childItems().at(i)->deleteLater();
        }

        mChildNode = DoricViewNode::create(getContext(), type);
        mChildNode->setId(viewId);
        mChildNode->init(this);
        mChildNode->blend(props);

        QQmlListProperty<QQuickItem> contentChildren =
            qvariant_cast<QQmlListProperty<QQuickItem>>(
                parent->property("contentChildren"));
        contentChildren.append(&contentChildren, mChildNode->getNodeView());
      }
    }
  } else {
    mChildNode = DoricViewNode::create(getContext(), type);
    mChildNode->setId(viewId);
    mChildNode->init(this);
    mChildNode->blend(props);

    QQmlListProperty<QQuickItem> contentChildren =
        qvariant_cast<QQmlListProperty<QQuickItem>>(
            parent->property("contentChildren"));
    contentChildren.append(&contentChildren, mChildNode->getNodeView());
  }
}

void DoricScrollerNode::requestLayout() {
  this->mChildNode->requestLayout();
  DoricLayouts *layout = (DoricLayouts *)(mChildNode->getNodeView()
                                              ->property("doricLayout")
                                              .toULongLong());
  if (layout != nullptr) {
    layout->apply(QSizeF(mView->width(), mView->height()));

    mView->setProperty("contentWidth", layout->getMeasuredWidth());
    mView->setProperty("contentHeight", layout->getMeasuredHeight());
  }
}

void DoricScrollerNode::blendSubNode(QJsonValue subProperties) {
  if (mChildNode != nullptr) {
    mChildNode->blend(subProperties["props"]);
  }
}

QSizeF DoricScrollerNode::sizeThatFits(QSizeF size) {
  DoricLayouts *layout = (DoricLayouts *)mChildNode->getNodeView()
                             ->property("doricLayout")
                             .toULongLong();

  if (layout->getResolved()) {
    layout->apply(size);
  }

  return QSizeF(qMax(size.width(), layout->getMeasuredWidth()),
                qMax(size.height(), layout->getMeasuredHeight()));
}

DoricViewNode *DoricScrollerNode::getSubNodeById(QString id) {
  return id == mChildNode->getId() ? mChildNode : nullptr;
}
