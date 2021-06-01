#include <QDebug>
#include <QJsonDocument>
#include <QJsonObject>

#include "../shader/DoricRootNode.h"
#include "DoricShaderPlugin.h"

void DoricShaderPlugin::render(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValueString] {
        try {
          QJsonDocument document =
              QJsonDocument::fromJson(jsValueString.toUtf8());
          QJsonValue jsValue = document.object();

          QString viewId = jsValue["id"].toString();
          DoricRootNode *rootNode = getContext()->getRootNode();

          if (rootNode->getId().isEmpty() &&
              jsValue["type"].toString() == "Root") {
            rootNode->setId(viewId);
            rootNode->blend(jsValue["props"]);
            rootNode->requestLayout();
          } else {
            DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
            if (viewNode != nullptr) {
              viewNode->blend(jsValue["props"]);
              viewNode->requestLayout();
            }
          }
        } catch (...) {
          qCritical() << "render exception";
        }
      },
      DoricThreadMode::UI);
}

void DoricShaderPlugin::command(QString jsValueString, QString callbackId) {
  qCritical() << "command: " << jsValueString << " " << callbackId;
}
