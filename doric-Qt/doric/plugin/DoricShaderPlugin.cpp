#include "DoricShaderPlugin.h"

#include <QDebug>

void DoricShaderPlugin::render(QJSValue jsValue, QString callbackId) {
  qDebug() << getContext();
  getContext()->getDriver()->asyncCall(
      [this, jsValue] {
        QString viewId = jsValue.property("id").toString();
        getContext()->getDriver();
      },
      DoricThreadMode::UI);
}
