#include "DoricNetworkPlugin.h"
#include "utils/DoricNetworkService.h"

#include <QCoreApplication>
#include <QJsonDocument>
#include <QJsonObject>

void DoricNetworkPlugin::request(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  DoricNetworkService::getInstance()->request(jsValue, qApp,
                                              [](int code, QByteArray data) {
                                                qDebug() << code;
                                                qDebug() << data;
                                                qDebug() << "";
                                              });
}
