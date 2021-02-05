#include "DoricShaderPlugin.h"

#include <QDebug>

void DoricShaderPlugin::render(QJSValue jsValue, QString callbackId) {
  qDebug() << getContext();
}
