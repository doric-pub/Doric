#include <QDebug>

#include "../shader/DoricRootNode.h"
#include "DoricShaderPlugin.h"

void DoricShaderPlugin::render(QJSValue jsValue, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValue] {
        try {
          QString viewId = jsValue.property("id").toString();
          DoricRootNode *rootNode = getContext()->getRootNode();

          if (rootNode->getId().isEmpty() &&
              jsValue.property("type").toString() == "Root") {
            rootNode->setId(viewId);
            rootNode->blend(jsValue.property("props"));
          } else {
            DoricViewNode *viewNode = getContext()->targetViewNode(viewId);
            if (viewNode != nullptr) {
              viewNode->blend(jsValue.property("props"));
            }
          }
        } catch (...) {
          qCritical() << "render exception";
        }
      },
      DoricThreadMode::UI);
}
