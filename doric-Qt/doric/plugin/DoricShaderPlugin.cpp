#include "DoricShaderPlugin.h"

#include <QDebug>

DoricShaderPlugin::DoricShaderPlugin(QObject *parent) : QObject(parent) {}

void DoricShaderPlugin::render(QJSValue jsValue, QString callbackId) {
  qDebug() << "";
}
