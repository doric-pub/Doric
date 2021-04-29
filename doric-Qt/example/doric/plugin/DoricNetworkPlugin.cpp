#include "DoricNetworkPlugin.h"
#include "engine/DoricPromise.h"
#include "utils/DoricNetworkService.h"

#include <QCoreApplication>
#include <QJsonDocument>
#include <QJsonObject>

void DoricNetworkPlugin::request(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  DoricNetworkService::getInstance()->request(
      jsValue, qApp,
      [this, callbackId](int code, QList<QByteArray> headers, QByteArray data) {
        getContext()->getDriver()->asyncCall(
            [this, callbackId, code, headers, data] {
              QMap<QString, QVariant> map;
              map.insert("status", code);
              map.insert("headers", QVariant::fromValue(headers));
              map.insert("data", QString(data));

              QVariantList args;
              args.append(map);
              DoricPromise::resolve(getContext(), callbackId, args);
            },
            DoricThreadMode::JS);
      });
}
