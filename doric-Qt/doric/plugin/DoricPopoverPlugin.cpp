#include "DoricPopoverPlugin.h"
#include "engine/DoricPromise.h"
#include "shader/DoricRootNode.h"
#include "shader/DoricViewNode.h"

#include <QJsonDocument>
#include <QJsonObject>
#include <QQuickWindow>

void DoricPopoverPlugin::show(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValueString, callbackId] {
        QJsonDocument document =
            QJsonDocument::fromJson(jsValueString.toUtf8());
        QJsonValue jsValue = document.object();

        QQuickItem *rootItem =
            getContext()->getRootNode()->getRootView()->window()->contentItem();

        if (this->fullScreenView == nullptr) {
          QQmlComponent component(getContext()->getQmlEngine());

          const QUrl url(QStringLiteral("qrc:/doric/qml/stack.qml"));
          component.loadUrl(url);

          if (component.isError()) {
            qCritical() << component.errorString();
          }

          QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
          item->setWidth(rootItem->width());
          item->setHeight(rootItem->height());

          DoricLayouts *layout = new DoricLayouts();
          layout->setWidth(item->width());
          layout->setHeight(item->height());
          layout->setView(item);
          layout->setLayoutType(DoricLayoutType::DoricStack);

          item->setProperty("doricLayout", QString::number((qint64)layout));

          item->setParentItem(rootItem);

          this->fullScreenView = item;
        } else {
          DoricLayouts *layout =
              (DoricLayouts *)(this->fullScreenView->property("doricLayout")
                                   .toULongLong());
          layout->setWidth(rootItem->width());
          layout->setHeight(rootItem->height());
        }
        this->fullScreenView->setVisible(true);

        QString viewId = jsValue["id"].toString();
        QString type = jsValue["type"].toString();

        DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
        if (viewNode == nullptr) {
          viewNode = DoricViewNode::create(getContext(), type);
          viewNode->setId(viewId);
          viewNode->init(nullptr);

          viewNode->getNodeView()->setParentItem(this->fullScreenView);
        }

        viewNode->blend(jsValue["props"]);

        DoricLayouts *layout =
            (DoricLayouts *)(this->fullScreenView->property("doricLayout")
                                 .toULongLong());
        layout->apply();

        getContext()->addHeadNode(TYPE, viewNode);

        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::UI);
}

void DoricPopoverPlugin::dismiss(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValueString, callbackId] {
        QJsonDocument document =
            QJsonDocument::fromJson(jsValueString.toUtf8());
        QJsonValue jsValue = document.object();

        if (jsValue.toObject().contains("id")) {
          QString viewId = jsValue["id"].toString();

          DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
          this->dismissViewNode(viewNode);
        } else {
          this->dismissPopover();
        }

        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::UI);
}

void DoricPopoverPlugin::dismissViewNode(DoricViewNode *viewNode) {
  if (viewNode != nullptr) {
    getContext()->removeHeadNode(TYPE, viewNode);
    viewNode->getNodeView()->setParent(nullptr);
    viewNode->getNodeView()->setParentItem(nullptr);
    viewNode->getNodeView()->deleteLater();
  }

  if (getContext()->allHeadNodes(TYPE).size() == 0) {
    this->fullScreenView->setVisible(false);
  }
}

void DoricPopoverPlugin::dismissPopover() {
  foreach (DoricViewNode *node, getContext()->allHeadNodes(TYPE)) {
    dismissViewNode(node);
  }
}
