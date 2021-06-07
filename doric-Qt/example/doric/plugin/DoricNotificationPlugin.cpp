#include "DoricNotificationPlugin.h"

#include "engine/DoricPromise.h"

#include <QCoreApplication>
#include <QJsonDocument>
#include <QJsonObject>

void DoricNotificationPlugin::publish(QString jsValueString,
                                      QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

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

  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}

void DoricNotificationPlugin::unsubscribe(QString jsValueString,
                                          QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}
