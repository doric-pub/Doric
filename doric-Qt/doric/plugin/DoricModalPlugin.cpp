#include "DoricModalPlugin.h"
#include "shader/DoricRootNode.h"
#include "utils/DoricLayouts.h"

#include <QJsonDocument>
#include <QObject>
#include <QQmlComponent>
#include <QQuickWindow>
#include <QTimer>

void DoricModalPlugin::toast(QString jsValueString, QString callbackId) {
  getContext()->getDriver()->asyncCall(
      [this, jsValueString] {
        QJsonDocument document =
            QJsonDocument::fromJson(jsValueString.toUtf8());
        QJsonValue jsValue = document.object();

        QString msg = jsValue["msg"].toString();
        int gravity = jsValue["gravity"].toInt();

        QQmlComponent component(getContext()->getQmlEngine());
        const QUrl url(QStringLiteral("qrc:/doric/qml/toast.qml"));
        component.loadUrl(url);
        if (component.isError()) {
          qCritical() << component.errorString();
        }
        QQuickWindow *window = qobject_cast<QQuickWindow *>(component.create());

        QQuickWindow *parentWindow =
            getContext()->getRootNode()->getRootView()->window();

        window->contentItem()
            ->childItems()
            .at(0)
            ->childItems()
            .at(0)
            ->setProperty("text", msg);

        std::function setX = [window, parentWindow]() {
          window->setProperty("x",
                              (parentWindow->width() - window->width()) / 2.f +
                                  parentWindow->x());
        };
        std::function setY = [window, parentWindow, gravity]() {
          if ((gravity & DoricGravity::DoricGravityBottom) ==
              DoricGravity::DoricGravityBottom) {
            window->setProperty("y", parentWindow->height() - window->height() -
                                         20 + parentWindow->y());
          } else if ((gravity & DoricGravity::DoricGravityTop) ==
                     DoricGravity::DoricGravityTop) {
            window->setProperty("y", 20 + parentWindow->y());
          } else {
            window->setProperty(
                "y", (parentWindow->height() - window->height()) / 2 +
                         parentWindow->y());
          }
        };
        // init set x
        setX();
        // init set y
        setY();

        // update x
        connect(window, &QQuickWindow::widthChanged, setX);

        // update y
        connect(window, &QQuickWindow::heightChanged, setY);

        QTimer::singleShot(2000, qApp, [window]() { window->deleteLater(); });
      },
      DoricThreadMode::UI);
}
