#include "DoricGroupNode.h"

void DoricGroupNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "children") {
    mChildViewIds.clear();
    if (prop.isArray()) {
      QJsonArray array = prop.toArray();
      const int length = array.size();
      for (int i = 0; i < length; ++i) {
        QJsonValue value = array.at(i);
        if (value.isString()) {
          mChildViewIds.append(value.toString());
        }
      }
    }
  } else {
    DoricSuperNode::blend(view, name, prop);
  }
}

void DoricGroupNode::blend(QJsonValue jsValue) {
  DoricViewNode::blend(jsValue);
  configChildNode();
}

void DoricGroupNode::configChildNode() {
  QQuickItem *parent = nullptr;
  if (mType.isEmpty() || mType == "Stack") {
    parent = mView;
  } else {
    parent = mView->childItems().at(1);
  }
  for (int idx = 0; idx < mChildViewIds.size(); idx++) {
    QString id = mChildViewIds.at(idx);
    QJsonValue model = getSubModel(id);
    if (model.isUndefined()) {
      DoricRegistry *registry = getContext()->getDriver()->getRegistry();
      qCritical() << "model.isUndefined()";
      continue;
    }
    QString type = model["type"].toString();
    if (idx < mChildNodes.size()) {
      DoricViewNode *oldNode = mChildNodes.at(idx);
      if (id == oldNode->getId()) {
        // The same, skip
      } else {
        if (mReusable) {
          if (oldNode->getType() == type) {
            // Same type,can be reused
            oldNode->setId(id);
            oldNode->blend(model["props"]);
          } else {
            // Replace this view
            mChildNodes.remove(idx);
            oldNode->getNodeView()->setParent(nullptr);
            oldNode->getNodeView()->setParentItem(nullptr);
            oldNode->getNodeView()->deleteLater();

            DoricViewNode *newNode = DoricViewNode::create(getContext(), type);
            if (newNode != nullptr) {
              newNode->setId(id);
              newNode->init(this);

              if (idx >= mChildNodes.size()) {
                mChildNodes.append(newNode);
                newNode->getNodeView()->setParentItem(parent);
              } else {
                mChildNodes.insert(idx, newNode);
                newNode->getNodeView()->setParentItem(parent);
                newNode->getNodeView()->stackBefore(
                    parent->childItems().at(idx));
              }

              newNode->blend(model["props"]);
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
          }
          if (position >= 0) {
            // Found swap idx,position
            mChildNodes.swapItemsAt(position, idx);
            parent->childItems().swapItemsAt(position, idx);
          } else {
            // Not found,insert
            DoricViewNode *newNode = DoricViewNode::create(getContext(), type);
            if (newNode != nullptr) {
              newNode->setId(id);
              newNode->init(this);

              if (idx >= mChildNodes.size()) {
                mChildNodes.append(newNode);
                newNode->getNodeView()->setParentItem(parent);
              } else {
                mChildNodes.insert(idx, newNode);
                newNode->getNodeView()->setParentItem(parent);
                newNode->getNodeView()->stackBefore(
                    parent->childItems().at(idx));
              }

              newNode->blend(model["props"]);
            }
          }
        }
      }
    } else {
      // Insert
      DoricViewNode *newNode = DoricViewNode::create(getContext(), type);
      if (newNode != nullptr) {
        newNode->setId(id);
        newNode->init(this);

        if (idx >= mChildNodes.size()) {
          mChildNodes.append(newNode);
          newNode->getNodeView()->setParentItem(parent);
        } else {
          mChildNodes.insert(idx, newNode);
          newNode->getNodeView()->setParentItem(parent);
          newNode->getNodeView()->stackBefore(parent->childItems().at(idx));
        }

        newNode->blend(model["props"]);
      }
    }
  }

  int size = mChildNodes.size();
  for (int idx = mChildViewIds.size(); idx < size; idx++) {
    DoricViewNode *viewNode = mChildNodes.at(mChildViewIds.size());
    mChildNodes.remove(mChildViewIds.size());
    viewNode->getNodeView()->setParent(nullptr);
    viewNode->getNodeView()->setParentItem(nullptr);
    viewNode->getNodeView()->deleteLater();
  }
}

void DoricGroupNode::blendSubNode(QJsonValue subProperties) {
  QString subNodeId = subProperties["id"].toString();
  for (DoricViewNode *node : mChildNodes) {
    if (subNodeId == node->getId()) {
      node->blend(subProperties["props"]);
      break;
    }
  }
}
