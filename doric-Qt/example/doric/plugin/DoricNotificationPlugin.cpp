#include "DoricNotificationPlugin.h"

#include "engine/DoricPromise.h"
#include "utils/DoricGlobalBroadcast.h"

#include <QCoreApplication>
#include <QJsonDocument>
#include <QJsonObject>

void DoricNotificationPlugin::publish(QString jsValueString,
                                      QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QString name = jsValue["name"].toString();

  if (jsValue.toObject().contains("biz")) {
    QString biz = jsValue["biz"].toString();
    QString templateName = "__doric__%s1#%s2";
    name = templateName.replace("%s1", biz).replace("%s2", name);
  }

  QString data = jsValue["data"].toString();

  DoricGlobalBroadcast::getInstance()->publish(name, data);

  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}

void DoricNotificationPlugin::subscribe(QString jsValueString,
                                        QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QString name = jsValue["name"].toString();

  if (jsValue.toObject().contains("biz")) {
    QString biz = jsValue["biz"].toString();
    QString templateName = "__doric__%s1#%s2";
    name = templateName.replace("%s1", biz).replace("%s2", name);
  }

  QString notificationCallbackId = jsValue["callback"].toString();

  QString subscribeId = DoricGlobalBroadcast::getInstance()->subscribe(
      name, [this, notificationCallbackId](QString data) {
        QVariantList args;
        args.append(data);
        DoricPromise::resolve(getContext(), notificationCallbackId, args);
      });

  getContext()->getDriver()->asyncCall(
      [this, callbackId, notificationCallbackId] {
        QVariantList args;
        args.append(notificationCallbackId);
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}

void DoricNotificationPlugin::unsubscribe(QString jsValueString,
                                          QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  DoricGlobalBroadcast::getInstance()->unsubscribe(jsValueString);

  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}
