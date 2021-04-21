#include "DoricModalPlugin.h"
#include "shader/DoricRootNode.h"
#include "utils/DoricLayouts.h"

#include <QJsonDocument>
#include <QObject>
#include <QQmlComponent>
#include <QQuickItem>
#include <QTimer>

void DoricModalPlugin::toast(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValueString] {
        QJsonDocument document =
            QJsonDocument::fromJson(jsValueString.toUtf8());
        QJsonValue jsValue = document.object();

        QString msg = jsValue["msg"].toString();
        int gravity = jsValue["gravity"].toInt();

        QQuickItem *rootObject =
            getContext()->getRootNode()->getRootView()->parentItem();
        QQmlComponent component(getContext()->getQmlEngine());
        const QUrl url(QStringLiteral("qrc:/doric/qml/toast.qml"));
        component.loadUrl(url);
        if (component.isError()) {
          qCritical() << component.errorString();
        }
        QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
        item->setParentItem(rootObject);

        item->childItems().at(0)->childItems().at(0)->setProperty("text", msg);

        // init set x
        item->setProperty("x", (rootObject->width() - item->width()) / 2.f);
        // init set y
        if ((gravity & DoricGravity::DoricGravityBottom) ==
            DoricGravity::DoricGravityBottom) {
          item->setProperty("y", rootObject->height() - item->height() - 20);
        } else if ((gravity & DoricGravity::DoricGravityTop) ==
                   DoricGravity::DoricGravityTop) {
          item->setProperty("y", 20);
        } else {
          item->setProperty("y",
                            (rootObject->height() - item->height() - 88) / 2);
        }

        // update x
        connect(item, &QQuickItem::widthChanged, [rootObject, item]() {
          item->setProperty("x", (rootObject->width() - item->width()) / 2.f);
        });

        // update y
        connect(item, &QQuickItem::heightChanged,
                [rootObject, item, gravity]() {
                  if ((gravity & DoricGravity::DoricGravityBottom) ==
                      DoricGravity::DoricGravityBottom) {
                    item->setProperty("y", rootObject->height() -
                                               item->height() - 20);
                  } else if ((gravity & DoricGravity::DoricGravityTop) ==
                             DoricGravity::DoricGravityTop) {
                    item->setProperty("y", 20);
                  } else {
                    item->setProperty(
                        "y", (rootObject->height() - item->height() - 88) / 2);
                  }
                });

        QTimer::singleShot(2000, qApp, [item]() {
          item->setParent(nullptr);
          item->setParentItem(nullptr);
          item->deleteLater();
        });
      },
      DoricThreadMode::UI);
}
