#include "DoricNavBarPlugin.h"

#include "engine/DoricPromise.h"
#include "shader/DoricViewNode.h"
#include "utils/DoricUtils.h"

#include <QJsonDocument>
#include <QJsonObject>
#include <QQmlComponent>

void DoricNavBarPlugin::isHidden(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");

        if (navbar != nullptr) {
          bool hidden = !(navbar->isVisible());

          QVariantList args;
          args.append(hidden);
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}

void DoricNavBarPlugin::setHidden(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();
  bool hidden = jsValue["hidden"].toBool();

  getContext()->getDriver()->asyncCall(
      [this, callbackId, hidden] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");
        if (navbar != nullptr) {
          navbar->setVisible(!hidden);

          QVariantList args;
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}

void DoricNavBarPlugin::setTitle(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();
  QString titleString = jsValue["title"].toString();

  getContext()->getDriver()->asyncCall(
      [this, callbackId, titleString] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");
        if (navbar != nullptr) {
          QQuickItem *title = navbar->findChild<QQuickItem *>("title");
          title->setProperty("text", titleString);

          QVariantList args;
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}

void DoricNavBarPlugin::setBgColor(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();
  QString bgColor = DoricUtils::doricColor(jsValue["color"].toInt()).name();

  getContext()->getDriver()->asyncCall(
      [this, callbackId, bgColor] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");
        if (navbar != nullptr) {
          navbar->setProperty("color", bgColor);

          QVariantList args;
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}

void DoricNavBarPlugin::setLeft(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  getContext()->getDriver()->asyncCall(
      [this, callbackId, jsValue] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");
        if (navbar != nullptr) {
          QString viewId = jsValue["id"].toString();
          QString type = jsValue["type"].toString();

          DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
          if (viewNode == nullptr) {
            viewNode = DoricViewNode::create(getContext(), type);
            viewNode->setId(viewId);
            viewNode->init(nullptr);
          }

          viewNode->blend(jsValue["props"]);

          QQuickItem *left = navbar->findChild<QQuickItem *>("left");
          foreach (QQuickItem *child, left->childItems()) {
            child->setParentItem(nullptr);
            child->deleteLater();
          }
          viewNode->getNodeView()->setParentItem(left);

          getContext()->addHeadNode(TYPE_LEFT, viewNode);

          DoricLayouts *layout = (DoricLayouts *)(viewNode->getNodeView()
                                                      ->property("doricLayout")
                                                      .toULongLong());
          layout->apply(QSizeF(navbar->width(), navbar->height()));

          QVariantList args;
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}

void DoricNavBarPlugin::setRight(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  getContext()->getDriver()->asyncCall(
      [this, callbackId, jsValue] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");
        if (navbar != nullptr) {
          QString viewId = jsValue["id"].toString();
          QString type = jsValue["type"].toString();

          DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
          if (viewNode == nullptr) {
            viewNode = DoricViewNode::create(getContext(), type);
            viewNode->setId(viewId);
            viewNode->init(nullptr);
          }

          viewNode->blend(jsValue["props"]);

          QQuickItem *right = navbar->findChild<QQuickItem *>("right");
          foreach (QQuickItem *child, right->childItems()) {
            child->setParentItem(nullptr);
            child->deleteLater();
          }
          viewNode->getNodeView()->setParentItem(right);

          getContext()->addHeadNode(TYPE_RIGHT, viewNode);

          DoricLayouts *layout = (DoricLayouts *)(viewNode->getNodeView()
                                                      ->property("doricLayout")
                                                      .toULongLong());
          layout->apply(QSizeF(navbar->width(), navbar->height()));

          QVariantList args;
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}

void DoricNavBarPlugin::setCenter(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  getContext()->getDriver()->asyncCall(
      [this, callbackId, jsValue] {
        QQuickItem *navbar = getContext()
                                 ->getQmlEngine()
                                 ->rootObjects()
                                 .at(0)
                                 ->findChild<QQuickItem *>("navbar");
        if (navbar != nullptr) {
          QString viewId = jsValue["id"].toString();
          QString type = jsValue["type"].toString();

          DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
          if (viewNode == nullptr) {
            viewNode = DoricViewNode::create(getContext(), type);
            viewNode->setId(viewId);
            viewNode->init(nullptr);
          }

          viewNode->blend(jsValue["props"]);

          QQuickItem *center = navbar->findChild<QQuickItem *>("center");
          foreach (QQuickItem *child, center->childItems()) {
            child->setParentItem(nullptr);
            child->deleteLater();
          }
          viewNode->getNodeView()->setParentItem(center);

          getContext()->addHeadNode(TYPE_CENTER, viewNode);

          DoricLayouts *layout = (DoricLayouts *)(viewNode->getNodeView()
                                                      ->property("doricLayout")
                                                      .toULongLong());
          layout->apply(QSizeF(navbar->width(), navbar->height()));

          QVariantList args;
          DoricPromise::resolve(getContext(), callbackId, args);
        } else {
          QVariantList args;
          args.append("Not implement NavBar");
          DoricPromise::reject(getContext(), callbackId, args);
        }
      },
      DoricThreadMode::UI);
}
