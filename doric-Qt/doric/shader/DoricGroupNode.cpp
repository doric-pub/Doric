#include "DoricGroupNode.h"

void DoricGroupNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "children") {
    mChildViewIds.clear();
    if (prop.isArray()) {
      const int length = prop.property("length").toInt();
      for (int i = 0; i < length; ++i) {
        QJSValue value = prop.property(i);
        if (value.isString()) {
          mChildViewIds.append(value.toString());
        }
      }
    }
  } else {
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricGroupNode::blend(QJSValue jsValue) {
  DoricViewNode::blend(jsValue);
  configChildNode();
}

void DoricGroupNode::configChildNode() {
  for (int idx = 0; idx < mChildViewIds.size(); idx++) {
    QString id = mChildViewIds.at(idx);
    QJSValue model = getSubModel(id);
    if (model.isUndefined()) {
      DoricRegistry *registry = getContext()->getDriver()->getRegistry();
      qCritical() << "model.isUndefined()";
      continue;
    }
    QString type = model.property("type").toString();
    if (idx < mChildNodes.size()) {
      DoricViewNode *oldNode = mChildNodes.at(idx);
      if (id == oldNode->getId()) {
        // The same, skip
        if (mReusable) {
          if (oldNode->getType() == type) {
            oldNode->setId(id);
            oldNode->blend(model.property("props"));
          } else {
            mChildNodes.remove(idx);
            oldNode->getNodeView()->setParent(nullptr);
            oldNode->getNodeView()->setParentItem(nullptr);
            oldNode->getNodeView()->deleteLater();

            DoricViewNode *newNode = DoricViewNode::create(getContext(), type);
            if (newNode != nullptr) {
              newNode->setId(id);
              newNode->init(this);
              newNode->blend(model.property("props"));
              mChildNodes.insert(idx, newNode);

              int minIndex = qMin(idx, mView->childItems().size());
              newNode->getNodeView()->setParentItem(mView);
              newNode->getNodeView()->stackBefore(
                  mView->childItems().at(minIndex));
            }
          }
        } else {
          // Find in remain nodes
          int position = -1;
          for (int start = idx + 1; start < mChildNodes.size(); start++) {
            DoricViewNode *node = mChildNodes.at(start);
            if (id == node->getId()) {
              // Found
              position = start;
              break;
            }
            if (position >= 0) {
              // Found swap idx,position
              DoricViewNode *reused = mChildNodes.at(position);
              mChildNodes.removeAt(position);

              DoricViewNode *abandoned = mChildNodes.at(idx);
              mChildNodes.insert(idx, reused);
              mChildNodes.insert(position, abandoned);

              // View swap index
              reused->getNodeView()->setParent(nullptr);
              reused->getNodeView()->setParentItem(nullptr);
              int minIndex = qMin(idx, mView->childItems().size());
              reused->getNodeView()->setParentItem(mView);
              reused->getNodeView()->stackBefore(
                  mView->childItems().at(minIndex));

              abandoned->getNodeView()->setParent(nullptr);
              abandoned->getNodeView()->setParentItem(nullptr);
              abandoned->getNodeView()->setParentItem(mView);
              abandoned->getNodeView()->stackBefore(
                  mView->childItems().at(position));
            } else {
              // Not found,insert
              DoricViewNode *newNode =
                  DoricViewNode::create(getContext(), type);
              if (newNode != nullptr) {
                newNode->setId(id);
                newNode->init(this);
                newNode->blend(model.property("props"));
                mChildNodes.insert(idx, newNode);

                int minIndex = qMin(idx, mView->childItems().size());
                newNode->getNodeView()->setParentItem(mView);
                newNode->getNodeView()->stackBefore(
                    mView->childItems().at(minIndex));
              }
            }
          }
        }
      }
    } else {
      // Insert
    }
  }
}

void DoricGroupNode::blendSubNode(QJSValue subProperties) {
  QString subNodeId = subProperties.property("id").toString();
  for (DoricViewNode *node : mChildNodes) {
    if (subNodeId == node->getId()) {
      node->blend(subProperties.property("props"));
      break;
    }
  }
}
