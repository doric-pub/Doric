#include <QDebug>
#include <QJsonObject>

#include "../shader/DoricRootNode.h"
#include "DoricShaderPlugin.h"

void DoricShaderPlugin::render(QJsonObject *jsValue, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValue] {
        try {
          QString viewId = jsValue->value("id").toString();
          DoricRootNode *rootNode = getContext()->getRootNode();

          if (rootNode->getId().isEmpty() &&
              jsValue->value("type").toString() == "Root") {
            rootNode->setId(viewId);
            rootNode->blend(jsValue->value("props"));
          } else {
            DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
            if (viewNode != nullptr) {
              viewNode->blend(jsValue->value("props"));
            }
          }
        } catch (...) {
          qCritical() << "render exception";
        }
      },
      DoricThreadMode::UI);
}
