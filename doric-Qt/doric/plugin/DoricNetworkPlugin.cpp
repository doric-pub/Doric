#include "DoricNetworkPlugin.h"

#include <QJsonDocument>
#include <QJsonObject>

void DoricNetworkPlugin::request(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QString url = jsValue["url"].toString();
  QString method = jsValue["method"].toString();

  QJsonValue headerVal = jsValue["headers"];
  QJsonValue dataVal = jsValue["data"];
  QJsonValue timeoutVal = jsValue["timeout"];

  if (headerVal.isObject()) {
    foreach (QString key, headerVal.toObject().keys()) {
      httpRequest.setRawHeader(key.toUtf8(),
                               headerVal[key].toString().toUtf8());
    }
  }

  QObject::connect(&networkAccessManager, SIGNAL(finished(QNetworkReply *)),
                   this, SLOT(networkRequestFinished(QNetworkReply *)));

  if (method == "get") {
    httpRequest.setUrl(QUrl(url));
    networkAccessManager.get(httpRequest);
  }
}
void DoricNetworkPlugin::networkRequestFinished(QNetworkReply *reply) {
  int statusCode =
      reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();

  if (reply->error() == QNetworkReply::NoError) {
  } else {
  }

  reply->deleteLater();
}
