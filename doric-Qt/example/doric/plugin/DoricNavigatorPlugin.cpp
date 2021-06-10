#include "DoricNavigatorPlugin.h"

#include "DoricPanel.h"
#include "engine/DoricPromise.h"
#include "loader/DoricJSLoaderManager.h"
#include "utils/DoricUtils.h"

#include <QJsonDocument>
#include <QJsonObject>
#include <QQmlApplicationEngine>
#include <QQmlComponent>
#include <QQuickItem>

void DoricNavigatorPlugin::push(QString jsValueString, QString callbackId) {

  QJsonDocument document = QJsonDocument::fromJson(jsValueString.toUtf8());
  QJsonValue jsValue = document.object();

  bool animated = true;
  QString source = jsValue["source"].toString();
  QString alias = source;
  QJsonValue config = jsValue["config"];

  if (config.isObject()) {
    animated = config["animated"].toBool();
    alias = config["alias"].toString();
  }

  getContext()->getDriver()->asyncCall(
      [this, source, alias] {
        std::shared_ptr<DoricAsyncResult> asyncResult =
            DoricJSLoaderManager::getInstance()->request(source);

        QString script = asyncResult->getResult();

        QQmlComponent component(getContext()->getQmlEngine());
        const QUrl url(QStringLiteral("qrc:/doric/qml/panel.qml"));
        component.loadUrl(url);
        QObject *object = component.create();
        QQuickItem *quickItem = qobject_cast<QQuickItem *>(object);
        DoricPanel *panel =
            new DoricPanel(getContext()->getQmlEngine(), quickItem);
        quickItem->setWidth(600);
        quickItem->setHeight(800);
        panel->config(script, alias, NULL);

        QObject *window = getContext()->getQmlEngine()->rootObjects().at(0);
        QVariant arg = QVariant::fromValue(object);
        QMetaObject::invokeMethod(window, "navigatorPush",
                                  Q_ARG(QVariant, arg));
      },
      DoricThreadMode::UI);

  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}

void DoricNavigatorPlugin::pop(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this] {
        QObject *window = getContext()->getQmlEngine()->rootObjects().at(0);
        QMetaObject::invokeMethod(window, "navigatorPop");
      },
      DoricThreadMode::UI);

  getContext()->getDriver()->asyncCall(
      [this, callbackId] {
        QVariantList args;
        DoricPromise::resolve(getContext(), callbackId, args);
      },
      DoricThreadMode::JS);
}

void DoricNavigatorPlugin::popSelf(QString jsValueString, QString callbackId) {}

void DoricNavigatorPlugin::popToRoot(QString jsValueString,
                                     QString callbackId) {}

void DoricNavigatorPlugin::openUrl(QString jsValueString, QString callbackId) {}
