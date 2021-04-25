#ifndef DORICNETWORKPLUGIN_H
#define DORICNETWORKPLUGIN_H

#include "DoricNativePlugin.h"

#include <QSettings>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QNetworkAccessManager>

class DoricNetworkPlugin : public DoricNativePlugin {
  Q_OBJECT
public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void request(QString jsValueString, QString callbackId);

private:
  QNetworkRequest httpRequest;
  QNetworkAccessManager networkAccessManager;

public slots:
  void networkRequestFinished(QNetworkReply *reply);
};
#endif // DORICNETWORKPLUGIN_H
