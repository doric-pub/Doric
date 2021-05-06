#include "DoricStoragePlugin.h"
#include "engine/DoricPromise.h"

#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonValue>
#include <QSettings>

const QString DoricStoragePlugin::PREF_NAME = "pref_doric";

void DoricStoragePlugin::setItem(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QJsonValue zone = jsValue["zone"];
  QString key = jsValue["key"].toString();
  QString value = jsValue["value"].toString();

  QString prefName;
  if (zone.isString()) {
    prefName = PREF_NAME + "_" + zone.toString();
  } else {
    prefName = PREF_NAME;
  }

  QSettings settings;
  settings.setValue(prefName + "/" + key, value);

  QVariantList args;
  DoricPromise::resolve(getContext(), callbackId, args);
}

void DoricStoragePlugin::getItem(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QJsonValue zone = jsValue["zone"];
  QString key = jsValue["key"].toString();

  QString prefName;
  if (zone.isString()) {
    prefName = PREF_NAME + "_" + zone.toString();
  } else {
    prefName = PREF_NAME;
  }

  QSettings settings;
  QVariant value = settings.value(prefName + "/" + key);

  QVariantList args;
  args.append(value);
  DoricPromise::resolve(getContext(), callbackId, args);
}

void DoricStoragePlugin::remove(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QJsonValue zone = jsValue["zone"];
  QString key = jsValue["key"].toString();

  QString prefName;
  if (zone.isString()) {
    prefName = PREF_NAME + "_" + zone.toString();
  } else {
    prefName = PREF_NAME;
  }

  QSettings settings;
  settings.remove(prefName + "/" + key);

  QVariantList args;
  DoricPromise::resolve(getContext(), callbackId, args);
}

void DoricStoragePlugin::clear(QString jsValueString, QString callbackId) {
  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  QJsonValue zone = jsValue["zone"];
  QString key = jsValue["key"].toString();

  QString prefName;
  if (zone.isString()) {
    prefName = PREF_NAME + "_" + zone.toString();
  } else {
    prefName = PREF_NAME;
  }

  QSettings settings;
  settings.clear();

  QVariantList args;
  DoricPromise::resolve(getContext(), callbackId, args);
}
